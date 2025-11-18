import { useEffect, useState } from 'react';
import { initializePushNotifications } from '../utils/pushNotifications';
import { getVapidPublicKey, registerPushSubscription } from '../api/pushSubscriptions';

export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Проверяем поддержку при монтировании
    const checkSupport = () => {
      const supported = 
        'serviceWorker' in navigator &&
        'PushManager' in window &&
        'Notification' in window;
      setIsSupported(supported);
    };

    checkSupport();
  }, []);

  const enablePushNotifications = async () => {
    setIsLoading(true);
    try {
      // Получаем VAPID ключ с бэкенда
      const vapidKey = await getVapidPublicKey();
      
      // Инициализируем push-уведомления
      const success = await initializePushNotifications(
        vapidKey,
        async (subscription) => {
          // Отправляем подписку на сервер
          await registerPushSubscription(subscription);
        }
      );

      setIsSubscribed(success);
      return success;
    } catch (error) {
      console.error('Ошибка включения push-уведомлений:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isSupported,
    isSubscribed,
    isLoading,
    enablePushNotifications
  };
};
