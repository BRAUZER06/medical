import { useEffect, useState } from 'react';
import { initializePushNotifications, getCurrentSubscription } from '../utils/pushNotifications';
import { getVapidPublicKey, registerPushSubscription } from '../api/pushSubscriptions';

export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Проверяем поддержку и существующую подписку при монтировании
    const checkSupportAndSubscription = async () => {
      const supported = 
        'serviceWorker' in navigator &&
        'PushManager' in window &&
        'Notification' in window;
      setIsSupported(supported);

      // Проверяем, есть ли уже активная подписка
      if (supported) {
        const existingSubscription = await getCurrentSubscription();
        setIsSubscribed(!!existingSubscription);
        
        // Если есть подписка, синхронизируем её с сервером
        if (existingSubscription) {
          try {
            await registerPushSubscription(existingSubscription);
            console.log('Подписка синхронизирована с сервером');
          } catch (error) {
            console.error('Ошибка синхронизации подписки:', error);
          }
        }
      }
    };

    checkSupportAndSubscription();
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
