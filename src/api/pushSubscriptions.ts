import axiosClient from './axiosClient';

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

// Регистрация push-подписки на сервере
export const registerPushSubscription = async (
  subscription: PushSubscription
): Promise<void> => {
  const subscriptionData: PushSubscriptionData = {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: arrayBufferToBase64(subscription.getKey('p256dh')),
      auth: arrayBufferToBase64(subscription.getKey('auth'))
    }
  };

  await axiosClient.post('/push-subscriptions', subscriptionData);
};

// Удаление push-подписки с сервера
export const unregisterPushSubscription = async (
  endpoint: string
): Promise<void> => {
  await axiosClient.delete('/push-subscriptions', {
    data: { endpoint }
  });
};

// Получение VAPID публичного ключа
export const getVapidPublicKey = async (): Promise<string> => {
  const response = await axiosClient.get<{ publicKey: string }>('/push-subscriptions/vapid-key');
  return response.data.publicKey;
};

// Вспомогательная функция для конвертации ArrayBuffer в base64
function arrayBufferToBase64(buffer: ArrayBuffer | null): string {
  if (!buffer) return '';
  
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
