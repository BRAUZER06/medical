// src/utils/pwaManager.ts

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAInstallPrompt {
  show: () => Promise<boolean>;
  isAvailable: boolean;
}

class PWAManager {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private isInstalled = false;
  private isStandalone = false;

  constructor() {
    this.init();
  }

  private init() {
    // Проверяем, запущено ли приложение в standalone режиме
    this.isStandalone = this.checkIfStandalone();
    
    // Проверяем, установлено ли приложение
    this.isInstalled = this.checkIfInstalled();

    // Слушаем событие beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this.onInstallPromptReady();
    });

    // Слушаем событие установки
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App installed');
      this.isInstalled = true;
      this.deferredPrompt = null;
      this.onAppInstalled();
    });

    // Регистрируем Service Worker
    this.registerServiceWorker();
  }

  private checkIfStandalone(): boolean {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://')
    );
  }

  private checkIfInstalled(): boolean {
    // Для iOS проверяем standalone режим
    if (this.isIOSDevice()) {
      return this.isStandalone;
    }

    // Для Android проверяем display-mode
    return this.isStandalone;
  }

  private isIOSDevice(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  private async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
      console.warn('[PWA] Service Worker not supported');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('[PWA] Service Worker registered:', registration.scope);

      // Обновляем SW при необходимости
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          console.log('[PWA] New service worker installing...');
          newWorker.addEventListener('statechange', () => {
            console.log('[PWA] Service worker state changed:', newWorker.state);
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[PWA] New service worker installed, showing update banner');
              this.onServiceWorkerUpdate(registration);
            }
          });
        }
      });

      // Слушаем сообщения от Service Worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('[PWA] Message from SW:', event.data);
        if (event.data.type === 'SW_UPDATED') {
          console.log('[PWA] Service Worker updated successfully');
        }
      });

      // Проверяем, есть ли ожидающий обновления SW
      if (registration.waiting) {
        console.log('[PWA] Service worker waiting, showing update banner');
        this.onServiceWorkerUpdate(registration);
      }

      return registration;
    } catch (error) {
      console.error('[PWA] Service Worker registration failed:', error);
      return null;
    }
  }

  private onInstallPromptReady() {
    console.log('[PWA] Install prompt ready');
    // Можно показать кастомный баннер для установки
    this.showInstallBanner();
  }

  private onAppInstalled() {
    console.log('[PWA] App installed successfully');
    this.hideInstallBanner();
    // Можно показать welcome сообщение
  }

  private onServiceWorkerUpdate(registration: ServiceWorkerRegistration) {
    console.log('[PWA] Service Worker update available');
    // Можно показать уведомление об обновлении
    this.showUpdateBanner(registration);
  }

  public async showInstallPrompt(): Promise<boolean> {
    if (!this.deferredPrompt) {
      console.warn('[PWA] Install prompt not available');
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      console.log('[PWA] Install prompt result:', outcome);
      
      if (outcome === 'accepted') {
        this.deferredPrompt = null;
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('[PWA] Install prompt error:', error);
      return false;
    }
  }

  public getInstallInstructions(): string {
    if (this.isIOSDevice()) {
      return `
        Чтобы добавить приложение на домашний экран:
        1. Нажмите кнопку "Поделиться" (↗️)
        2. Выберите "На экран «Домой»"
        3. Нажмите "Добавить"
      `;
    }

    return `
      Чтобы установить приложение:
      1. Нажмите на значок установки в адресной строке
      2. Или используйте меню браузера → "Установить приложение"
    `;
  }

  private showInstallBanner() {
    // Показываем баннер только если приложение не установлено
    if (this.isInstalled) return;

    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.className = 'pwa-install-banner';
    banner.innerHTML = `
      <div class="pwa-banner-content">
        <div class="pwa-banner-text">
          <h4>Установить приложение</h4>
          <p>Добавьте Medical Consultation на домашний экран для быстрого доступа</p>
        </div>
        <div class="pwa-banner-actions">
          <button id="pwa-install-btn" class="pwa-btn pwa-btn-primary">
            Установить
          </button>
          <button id="pwa-dismiss-btn" class="pwa-btn pwa-btn-secondary">
            Не сейчас
          </button>
        </div>
      </div>
    `;

    // Добавляем обработчики
    banner.querySelector('#pwa-install-btn')?.addEventListener('click', () => {
      this.showInstallPrompt();
      this.hideInstallBanner();
    });

    banner.querySelector('#pwa-dismiss-btn')?.addEventListener('click', () => {
      this.hideInstallBanner();
    });

    document.body.appendChild(banner);

    // Автоматически скрываем через 10 секунд
    setTimeout(() => {
      this.hideInstallBanner();
    }, 10000);
  }

  private hideInstallBanner() {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) {
      banner.remove();
    }
  }

  private showUpdateBanner(registration: ServiceWorkerRegistration) {
    // Удаляем существующий баннер, если есть
    const existingBanner = document.getElementById('pwa-update-banner');
    if (existingBanner) {
      existingBanner.remove();
    }

    const banner = document.createElement('div');
    banner.id = 'pwa-update-banner';
    banner.className = 'pwa-update-banner';
    banner.innerHTML = `
      <div class="pwa-banner-content">
        <div class="pwa-banner-text">
          <h4>Доступно обновление</h4>
          <p>Новая версия приложения готова к установке</p>
        </div>
        <div class="pwa-banner-actions">
          <button id="pwa-update-btn" class="pwa-btn pwa-btn-primary">
            Обновить
          </button>
          <button id="pwa-update-dismiss-btn" class="pwa-btn pwa-btn-secondary">
            Позже
          </button>
        </div>
      </div>
    `;

    banner.querySelector('#pwa-update-btn')?.addEventListener('click', () => {
      console.log('[PWA] User clicked update button');
      if (registration.waiting) {
        console.log('[PWA] Sending SKIP_WAITING message to service worker');
        // Отправляем сообщение новому SW для пропуска ожидания
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        // Слушаем событие controllerchange для перезагрузки
        const handleControllerChange = () => {
          console.log('[PWA] New service worker activated, reloading...');
          navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
          window.location.reload();
        };
        
        navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
        
        // Если через 3 секунды ничего не произошло, перезагружаем принудительно
        setTimeout(() => {
          console.log('[PWA] Force reload after timeout');
          navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
          window.location.reload();
        }, 3000);
      } else {
        console.log('[PWA] No waiting service worker, reloading anyway');
        window.location.reload();
      }
      banner.remove();
    });

    banner.querySelector('#pwa-update-dismiss-btn')?.addEventListener('click', () => {
      console.log('[PWA] User dismissed update banner');
      banner.remove();
    });

    document.body.appendChild(banner);
    console.log('[PWA] Update banner shown');
  }

  // Публичные методы
  public get isAppInstalled(): boolean {
    return this.isInstalled;
  }

  public get isRunningStandalone(): boolean {
    return this.isStandalone;
  }

  public get canInstall(): boolean {
    return !!this.deferredPrompt;
  }

  public get installPrompt(): PWAInstallPrompt {
    return {
      show: () => this.showInstallPrompt(),
      isAvailable: this.canInstall
    };
  }
}

// Экспортируем singleton
export const pwaManager = new PWAManager();
export default pwaManager;
