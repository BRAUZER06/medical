import { useState, useEffect } from 'react';
import { 
  subscribeToPushNotifications, 
  checkPushSubscriptionStatus 
} from '../utils/pushNotifications';
import { showSuccessToast, showErrorToast } from '../utils/toast';

interface PushStatus {
  supported: boolean;
  subscribed: boolean;
  permission?: NotificationPermission;
}

interface UsePushNotificationsReturn {
  pushStatus: PushStatus;
  showBanner: boolean;
  isLoading: boolean;
  subscribeToPush: () => Promise<void>;
  dismissBanner: () => void;
}

export const usePushNotifications = (user: any): UsePushNotificationsReturn => {
  const [pushStatus, setPushStatus] = useState<PushStatus>({ 
    supported: false, 
    subscribed: false 
  });
  const [showBanner, setShowBanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const status = await checkPushSubscriptionStatus();
      setPushStatus(status);
      
      // Показываем баннер если:
      // - пользователь авторизован
      // - уведомления поддерживаются
      // - пользователь не подписан
      // - разрешение не заблокировано
      // - баннер не был отклонен в этой сессии
      if (user && 
          status.supported && 
          !status.subscribed && 
          status.permission !== 'denied' && 
          !bannerDismissed) {
        // Показываем баннер с небольшой задержкой для лучшего UX
        setTimeout(() => setShowBanner(true), 2000);
      }
    };
    
    checkStatus();
  }, [user, bannerDismissed]);

  const subscribeToPush = async () => {
    setIsLoading(true);
    try {
      const result = await subscribeToPushNotifications();
      if (result.success) {
        setPushStatus(prev => ({ ...prev, subscribed: true }));
        setShowBanner(false);
        showSuccessToast('Push-уведомления успешно включены!');
      } else {
        console.error('Не удалось подключить push-уведомления:', result.error);
        showErrorToast(`Не удалось включить уведомления: ${result.error}`);
      }
    } catch (error) {
      console.error('Ошибка при подписке:', error);
      showErrorToast('Произошла ошибка при подключении уведомлений');
    } finally {
      setIsLoading(false);
    }
  };

  const dismissBanner = () => {
    setShowBanner(false);
    setBannerDismissed(true);
  };

  return {
    pushStatus,
    showBanner,
    isLoading,
    subscribeToPush,
    dismissBanner
  };
};
