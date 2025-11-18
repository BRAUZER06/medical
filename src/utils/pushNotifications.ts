// Утилиты для работы с Push уведомлениями

// Конвертация VAPID ключа из base64 в Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
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

// Регистрация Service Worker
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });
      console.log('Service Worker зарегистрирован:', registration);
      return registration;
    } catch (error) {
      console.error('Ошибка регистрации Service Worker:', error);
      return null;
    }
  }
  console.warn('Service Worker не поддерживается браузером');
  return null;
}

// Запрос разрешения на уведомления
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('Браузер не поддерживает уведомления');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
}

// Подписка на Push уведомления
export async function subscribeToPushNotifications(
  vapidPublicKey: string
): Promise<PushSubscription | null> {
  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Проверяем существующую подписку
    let subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      console.log('Подписка уже существует');
      return subscription;
    }

    // Создаем новую подписку
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource
    });

    console.log('Новая подписка создана:', subscription);
    return subscription;
  } catch (error) {
    console.error('Ошибка подписки на Push уведомления:', error);
    return null;
  }
}

// Отписка от Push уведомлений
export async function unsubscribeFromPushNotifications(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      const successful = await subscription.unsubscribe();
      console.log('Отписка от уведомлений:', successful);
      return successful;
    }
    
    return true;
  } catch (error) {
    console.error('Ошибка отписки от уведомлений:', error);
    return false;
  }
}

// Получение текущей подписки
export async function getCurrentSubscription(): Promise<PushSubscription | null> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription;
  } catch (error) {
    console.error('Ошибка получения подписки:', error);
    return null;
  }
}

// Проверка поддержки Push уведомлений
export function isPushNotificationSupported(): boolean {
  return (
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

// Инициализация Push уведомлений
export async function initializePushNotifications(
  vapidPublicKey: string,
  onSubscribe?: (subscription: PushSubscription) => Promise<void>
): Promise<boolean> {
  try {
    // Проверка поддержки
    if (!isPushNotificationSupported()) {
      console.warn('Push уведомления не поддерживаются');
      return false;
    }

    // Регистрация Service Worker
    const registration = await registerServiceWorker();
    if (!registration) {
      return false;
    }

    // Запрос разрешения
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      console.warn('Разрешение на уведомления не получено');
      return false;
    }

    // Подписка на уведомления
    const subscription = await subscribeToPushNotifications(vapidPublicKey);
    if (!subscription) {
      return false;
    }

    // Отправка подписки на сервер
    if (onSubscribe) {
      await onSubscribe(subscription);
    }

    return true;
  } catch (error) {
    console.error('Ошибка инициализации Push уведомлений:', error);
    return false;
  }
}

// Тестовое уведомление (для проверки)
export async function showTestNotification(): Promise<void> {
  if (Notification.permission === 'granted') {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification('Тестовое уведомление', {
      body: 'Push уведомления работают!',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      tag: 'test-notification'
    });
  }
}
