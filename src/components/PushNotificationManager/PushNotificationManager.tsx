import React from 'react';
import { useSelector } from 'react-redux';
import PushNotificationBanner from '../PushNotificationBanner/PushNotificationBanner';
import { usePushNotifications } from '../../hooks/usePushNotifications';

interface RootState {
  auth: {
    user: any;
    token: string | null;
  };
}

const PushNotificationManager: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  
  const {
    showBanner,
    isLoading,
    subscribeToPush,
    dismissBanner
  } = usePushNotifications(user);

  if (!showBanner) {
    return null;
  }

  return (
    <PushNotificationBanner
      onSubscribe={subscribeToPush}
      onDismiss={dismissBanner}
      loading={isLoading}
    />
  );
};

export default PushNotificationManager;
