import React, { useState, useEffect } from 'react';
import pwaManager from '../../utils/pwaManager';

const PWAInstallPrompt: React.FC = () => {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const checkPWAStatus = () => {
      setCanInstall(pwaManager.canInstall);
      setIsInstalled(pwaManager.isAppInstalled);
      setShowPrompt(pwaManager.canInstall && !pwaManager.isAppInstalled);
    };

    // Проверяем статус сразу
    checkPWAStatus();

    // Проверяем периодически (для случая, когда prompt становится доступным позже)
    const interval = setInterval(checkPWAStatus, 1000);

    // Слушаем события установки
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      setShowPrompt(false);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      clearInterval(interval);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    const success = await pwaManager.showInstallPrompt();
    if (success) {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Сохраняем в localStorage, что пользователь отклонил установку
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Не показываем промпт если:
  // - приложение уже установлено
  // - промпт недоступен
  // - пользователь недавно отклонял (проверяем localStorage)
  useEffect(() => {
    const dismissedTime = localStorage.getItem('pwa-install-dismissed');
    if (dismissedTime) {
      const timePassed = Date.now() - parseInt(dismissedTime);
      // Не показываем 24 часа после отклонения
      if (timePassed < 24 * 60 * 60 * 1000) {
        setShowPrompt(false);
        return;
      }
    }
  }, []);

  if (!showPrompt || isInstalled) {
    return null;
  }

  return (
    <div className="pwa-install-banner">
      <div className="pwa-banner-content">
        <div className="pwa-banner-text">
          <h4>Установить приложение</h4>
          <p>Добавьте Medical Consultation на домашний экран для быстрого доступа</p>
        </div>
        <div className="pwa-banner-actions">
          <button 
            onClick={handleInstall}
            className="pwa-btn pwa-btn-primary"
          >
            Установить
          </button>
          <button 
            onClick={handleDismiss}
            className="pwa-btn pwa-btn-secondary"
          >
            Не сейчас
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
