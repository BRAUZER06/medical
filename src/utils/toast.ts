// src/utils/toast.ts

interface ToastOptions {
  type?: 'success' | 'error' | 'info';
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const showToast = (
  message: string, 
  options: ToastOptions = {}
): void => {
  const {
    type = 'info',
    duration = 3000,
    position = 'top-right'
  } = options;

  // Создаем элемент toast
  const toast = document.createElement('div');
  toast.className = `push-notification-toast ${type}`;
  toast.textContent = message;
  
  // Устанавливаем позицию
  toast.style.position = 'fixed';
  toast.style.zIndex = '9999';
  
  switch (position) {
    case 'top-right':
      toast.style.top = '20px';
      toast.style.right = '20px';
      break;
    case 'top-left':
      toast.style.top = '20px';
      toast.style.left = '20px';
      break;
    case 'bottom-right':
      toast.style.bottom = '20px';
      toast.style.right = '20px';
      break;
    case 'bottom-left':
      toast.style.bottom = '20px';
      toast.style.left = '20px';
      break;
  }

  // Добавляем анимацию появления
  toast.style.opacity = '0';
  toast.style.transform = 'translateY(-10px)';
  toast.style.transition = 'all 0.3s ease';

  document.body.appendChild(toast);

  // Анимация появления
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 10);

  // Удаление через указанное время
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, duration);
};

// Специализированные функции для разных типов уведомлений
export const showSuccessToast = (message: string, duration?: number) => {
  showToast(message, { type: 'success', duration });
};

export const showErrorToast = (message: string, duration?: number) => {
  showToast(message, { type: 'error', duration });
};

export const showInfoToast = (message: string, duration?: number) => {
  showToast(message, { type: 'info', duration });
};
