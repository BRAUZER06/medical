import React from 'react';

interface PushNotificationStatusProps {
  supported: boolean;
  subscribed: boolean;
  permission?: NotificationPermission;
  showText?: boolean;
  className?: string;
}

const PushNotificationStatus: React.FC<PushNotificationStatusProps> = ({
  supported,
  subscribed,
  permission,
  showText = true,
  className = ''
}) => {
  let status: 'enabled' | 'disabled' | 'not-supported';
  let text: string;
  
  if (!supported) {
    status = 'not-supported';
    text = 'Не поддерживается';
  } else if (permission === 'denied') {
    status = 'disabled';
    text = 'Заблокированы';
  } else if (subscribed) {
    status = 'enabled';
    text = 'Включены';
  } else {
    status = 'disabled';
    text = 'Отключены';
  }

  return (
    <div className={`push-notification-status ${status} ${className}`}>
      <div className={`push-notification-indicator ${status}`} />
      {showText && <span>{text}</span>}
    </div>
  );
};

export default PushNotificationStatus;
