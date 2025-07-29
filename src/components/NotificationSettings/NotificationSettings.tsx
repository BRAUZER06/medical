import React, { useState, useEffect } from 'react';
import { 
  subscribeToPushNotifications, 
  unsubscribeFromPushNotifications, 
  checkPushSubscriptionStatus 
} from '../../utils/pushNotifications';
import { showSuccessToast, showErrorToast } from '../../utils/toast';
import styles from './NotificationSettings.module.scss';

interface PushStatus {
  supported: boolean;
  subscribed: boolean;
  permission?: NotificationPermission;
}

const NotificationSettings: React.FC = () => {
  const [status, setStatus] = useState<PushStatus>({ supported: false, subscribed: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStatus = async () => {
      const currentStatus = await checkPushSubscriptionStatus();
      setStatus(currentStatus);
    };
    loadStatus();
  }, []);

  const handleToggleNotifications = async () => {
    setLoading(true);
    
    if (status.subscribed) {
      const result = await unsubscribeFromPushNotifications();
      if (result.success) {
        setStatus(prev => ({ ...prev, subscribed: false }));
        showSuccessToast('Push-уведомления отключены');
      } else {
        showErrorToast('Не удалось отключить уведомления');
      }
    } else {
      const result = await subscribeToPushNotifications();
      if (result.success) {
        setStatus(prev => ({ ...prev, subscribed: true }));
        showSuccessToast('Push-уведомления включены!');
      } else {
        showErrorToast(`Не удалось включить уведомления: ${result.error || 'Неизвестная ошибка'}`);
      }
    }
    
    setLoading(false);
  };

  if (!status.supported) {
    return (
      <div className={styles.notificationSettings}>
        <h3>Настройки уведомлений</h3>
        <div className={styles.unsupportedMessage}>
          <p>❌ {status.reason || 'Ваш браузер не поддерживает push-уведомления'}</p>
          
          {status.reason?.includes('PWA') && (
            <div className={styles.pwaInstructions}>
              <h4>Для получения уведомлений:</h4>
              <ol>
                <li>Нажмите кнопку <strong>Поделиться</strong> 📤 в Safari</li>
                <li>Выберите <strong>"На экран Домой"</strong></li>
                <li>Нажмите <strong>"Добавить"</strong></li>
                <li>Откройте приложение с домашнего экрана</li>
                <li>Включите уведомления в настройках</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.notificationSettings}>
      <h3>Настройки уведомлений</h3>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={status.subscribed}
          onChange={handleToggleNotifications}
          disabled={loading || status.permission === 'denied'}
          className={styles.checkbox}
        />
        <span className={styles.checkboxText}>
          {loading ? 'Загрузка...' : 'Получать push-уведомления о новых сообщениях'}
        </span>
      </label>
      
      {status.permission === 'denied' && (
        <p className={styles.warning}>
          Уведомления заблокированы в браузере. 
          Разрешите уведомления в настройках браузера для этого сайта.
        </p>
      )}
    </div>
  );
};

export default NotificationSettings;
