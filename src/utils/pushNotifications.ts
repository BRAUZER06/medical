// src/utils/pushNotifications.ts

// Конвертация VAPID ключа
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
  return localStorage.getItem('authToken'); // Замените на ваш способ хранения токена
}

interface PushSubscriptionResult {
  success: boolean;
  error?: string;
}

interface PushStatus {
  supported: boolean;
  subscribed: boolean;
  permission?: NotificationPermission;
}

// Основная функция подписки
export async function subscribeToPushNotifications(): Promise<PushSubscriptionResult> {
  // Проверка поддержки
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker не поддерживается');
    return { success: false, error: 'Service Worker не поддерживается' };
  }

  if (!('PushManager' in window)) {
    console.log('Push messaging не поддерживается');
    return { success: false, error: 'Push messaging не поддерживается' };
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
    const vapidResponse = await fetch('http://localhost:8080/api/vapid-public-key');
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
    const subscribeResponse = await fetch('/api/push-subscription', {
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
    const response = await fetch('/api/push-subscription', {
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
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return { supported: false, subscribed: false };
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
