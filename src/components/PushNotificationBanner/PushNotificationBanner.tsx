import React from 'react';
import Button from '../Button/Button';
import styles from './PushNotificationBanner.module.scss';

interface PushNotificationBannerProps {
  onSubscribe: () => void;
  onDismiss: () => void;
  loading?: boolean;
}

const PushNotificationBanner: React.FC<PushNotificationBannerProps> = ({
  onSubscribe,
  onDismiss,
  loading = false
}) => {
  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <div className={styles.text}>
          <h4>Не пропустите новые сообщения!</h4>
          <p>Включите уведомления, чтобы получать сообщения от врачей в реальном времени</p>
        </div>
        <div className={styles.actions}>
          <Button 
            onClick={onSubscribe}
            disabled={loading}
          >
            {loading ? 'Подключение...' : 'Включить уведомления'}
          </Button>
          <button 
            className={styles.dismissButton}
            onClick={onDismiss}
            disabled={loading}
          >
            Не сейчас
          </button>
        </div>
      </div>
      <button 
        className={styles.closeButton}
        onClick={onDismiss}
        disabled={loading}
        aria-label="Закрыть"
      >
        ×
      </button>
    </div>
  );
};

export default PushNotificationBanner;
