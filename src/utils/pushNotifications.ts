// src/utils/pushNotifications.ts

// Конфигурация URL-ов
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://only-doc.ru/api';
const PUSH_SERVICE_URL = import.meta.env.VITE_PUSH_SERVICE_URL || 'https://only-doc.ru:8080';

// Простая функция для проверки статуса push уведомлений  
export async function checkPushStatus(): Promise<any> {
  const status = {
    supported: isPushSupported().supported,
    permission: 'Notification' in window ? Notification.permission : 'not supported',
    isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
    isStandalone: (window.navigator as any).standalone === true || 
      window.matchMedia('(display-mode: standalone)').matches,
    hasServiceWorker: 'serviceWorker' in navigator,
    hasSubscription: false,
    endpoint: null
  };

  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration?.pushManager) {
        const subscription = await registration.pushManager.getSubscription();
        status.hasSubscription = !!subscription;
        status.endpoint = subscription?.endpoint || null;
      }
    } catch (error) {
      console.error('Error checking push status:', error);
    }
  }

  return status;
}
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Конвертация ArrayBuffer в Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Получение токена авторизации
function getAuthToken(): string | null {
  return localStorage.getItem('jwt_token'); // Используем тот же ключ что и в jwt.ts
}

// Получение базового URL для API
function getApiBaseUrl(): string {
  return API_BASE_URL;
}

// Получение URL для Push сервиса
function getPushServiceUrl(): string {
  return PUSH_SERVICE_URL;
}

interface PushSubscriptionResult {
  success: boolean;
  error?: string;
}

interface PushStatus {
  supported: boolean;
  subscribed: boolean;
  permission?: NotificationPermission;
  reason?: string; // Причина неподдержки
}

// Проверка поддержки push-уведомлений с учетом Safari/iOS
function isPushSupported(): { supported: boolean; reason?: string } {
  // Проверяем базовую поддержку
  if (!('serviceWorker' in navigator)) {
    return { supported: false, reason: 'Service Worker не поддерживается' };
  }

  if (!('PushManager' in window)) {
    return { supported: false, reason: 'Push Manager не поддерживается' };
  }

  if (!('Notification' in window)) {
    return { supported: false, reason: 'Notifications API не поддерживается' };
  }

  // Специальная проверка для Safari/iOS
  const userAgent = navigator.userAgent.toLowerCase();
  const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  
  if (isSafari || isIOS) {
    // Safari поддерживает push только в PWA режиме
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone === true ||
                         document.referrer.includes('android-app://');
    
    if (!isStandalone) {
      return { 
        supported: false, 
        reason: 'Safari поддерживает push-уведомления только для PWA. Добавьте приложение на домашний экран.' 
      };
    }
    
    // Проверяем версию Safari/iOS
    const safariVersion = userAgent.match(/version\/(\d+)/)?.[1];
    if (safariVersion && parseInt(safariVersion) < 16) {
      return { 
        supported: false, 
        reason: 'Требуется Safari 16.4+ для поддержки push-уведомлений' 
      };
    }
  }

  return { supported: true };
}

// Основная функция подписки
export async function subscribeToPushNotifications(): Promise<PushSubscriptionResult> {
  // Проверка поддержки
  const supportCheck = isPushSupported();
  if (!supportCheck.supported) {
    console.log('Push уведомления не поддерживаются:', supportCheck.reason);
    return { success: false, error: supportCheck.reason || 'Push уведомления не поддерживаются' };
  }

  // Специальная проверка для iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isStandalone = (window.navigator as any).standalone === true || 
    window.matchMedia('(display-mode: standalone)').matches;
  
  if (isIOS && !isStandalone) {
    console.log('iOS: приложение должно быть добавлено на домашний экран для push уведомлений');
    return { 
      success: false, 
      error: 'На iOS приложение должно быть добавлено на домашний экран для получения push-уведомлений' 
    };
  }

  try {
    // Регистрация Service Worker
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker зарегистрирован');

    // Запрос разрешения на уведомления
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return { success: false, error: 'Разрешение на уведомления не получено' };
    }

    // Получение VAPID ключа с Go сервиса
    const vapidResponse = await fetch(`${getPushServiceUrl()}/api/vapid-public-key`);
    if (!vapidResponse.ok) {
      throw new Error('Не удалось получить VAPID ключ');
    }
    const { public_key } = await vapidResponse.json();

    // Создание подписки
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(public_key)
    });

    // Отправка подписки на Rails сервер
    const subscribeResponse = await fetch(`${getApiBaseUrl()}/push-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        keys: {
          p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
          auth: arrayBufferToBase64(subscription.getKey('auth')!)
        }
      })
    });

    if (!subscribeResponse.ok) {
      throw new Error('Не удалось зарегистрировать подписку');
    }

    console.log('Push-уведомления успешно подключены');
    return { success: true };

  } catch (error) {
    console.error('Ошибка подписки на push-уведомления:', error);
    return { success: false, error: (error as Error).message };
  }
}

// Отписка от уведомлений
export async function unsubscribeFromPushNotifications(): Promise<PushSubscriptionResult> {
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
      }
    }

    // Удаление подписки с сервера
    const response = await fetch(`${getApiBaseUrl()}/push-subscription`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });

    return { success: response.ok };
  } catch (error) {
    console.error('Ошибка отписки:', error);
    return { success: false, error: (error as Error).message };
  }
}

// Проверка статуса подписки
export async function checkPushSubscriptionStatus(): Promise<PushStatus> {
  const supportCheck = isPushSupported();
  if (!supportCheck.supported) {
    return { 
      supported: false, 
      subscribed: false,
      reason: supportCheck.reason
    };
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      return { supported: true, subscribed: false };
    }

    const subscription = await registration.pushManager.getSubscription();
    return { 
      supported: true, 
      subscribed: !!subscription,
      permission: Notification.permission 
    };
  } catch (error) {
    console.error('Ошибка проверки статуса:', error);
    return { supported: true, subscribed: false };
  }
}
