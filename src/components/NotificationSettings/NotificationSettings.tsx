import React from 'react';
import { usePushNotifications } from '../../hooks/usePushNotifications';
import styles from './NotificationSettings.module.scss';

export const NotificationSettings: React.FC = () => {
  const { isSupported, isSubscribed, isLoading, enablePushNotifications } = usePushNotifications();

  const handleEnableNotifications = async () => {
    const success = await enablePushNotifications();
    if (success) {
      alert('Push-уведомления успешно включены!');
    } else {
      alert('Не удалось включить push-уведомления. Проверьте разрешения браузера.');
    }
  };

  if (!isSupported) {
    return (
      <div className={styles.notificationSettings}>
        <h3>Push-уведомления</h3>
        <p className={styles.warning}>
          Ваш браузер не поддерживает push-уведомления
        </p>
      </div>
    );
  }

  return (
    <div className={styles.notificationSettings}>
      <h3>Push-уведомления</h3>
      <p className={styles.description}>
        Получайте уведомления о новых сообщениях и напоминания о приемах врачей
      </p>
      
      <div className={styles.settingsGroup}>
        <div className={styles.setting}>
          <div className={styles.settingInfo}>
            <strong>Уведомления о сообщениях</strong>
            <span>Получайте уведомления при новых сообщениях в чате</span>
          </div>
        </div>
        
        <div className={styles.setting}>
          <div className={styles.settingInfo}>
            <strong>Напоминания о приемах</strong>
            <span>Получайте напоминания за 10 минут до приема врача</span>
          </div>
        </div>
      </div>

      {!isSubscribed && (
        <button 
          className={styles.enableButton}
          onClick={handleEnableNotifications}
          disabled={isLoading}
        >
          {isLoading ? 'Включение...' : 'Включить уведомления'}
        </button>
      )}

      {isSubscribed && (
        <div className={styles.successMessage}>
          ✓ Push-уведомления включены
        </div>
      )}
    </div>
  );
};
