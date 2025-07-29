import React, { useState, useEffect } from 'react';
import pwaManager from '../../utils/pwaManager';

interface PWAStatusProps {
  showInstallButton?: boolean;
  showText?: boolean;
  className?: string;
}

const PWAStatus: React.FC<PWAStatusProps> = ({
  showInstallButton = false,
  showText = true,
  className = ''
}) => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const updateStatus = () => {
      setIsInstalled(pwaManager.isAppInstalled);
      setIsStandalone(pwaManager.isRunningStandalone);
      setCanInstall(pwaManager.canInstall);
    };

    updateStatus();

    // Обновляем статус периодически
    const interval = setInterval(updateStatus, 2000);

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      clearInterval(interval);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    await pwaManager.showInstallPrompt();
  };

  const getStatusText = () => {
    if (isInstalled && isStandalone) {
      return 'Запущено как приложение';
    } else if (isInstalled) {
      return 'Приложение установлено';
    } else {
      return 'Не установлено';
    }
  };

  const getStatusClass = () => {
    if (isInstalled) {
      return 'installed';
    }
    return 'not-installed';
  };

  return (
    <div className={`pwa-status-container ${className}`}>
      <div className={`pwa-status-indicator ${getStatusClass()}`}>
        {showText && <span>{getStatusText()}</span>}
      </div>
      
      {showInstallButton && canInstall && !isInstalled && (
        <button 
          onClick={handleInstall}
          className="pwa-btn pwa-btn-primary"
          style={{ marginLeft: '8px', fontSize: '12px', padding: '4px 8px' }}
        >
          Установить
        </button>
      )}
    </div>
  );
};

export default PWAStatus;
