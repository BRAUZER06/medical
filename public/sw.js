// Service Worker для Medical Consultation PWA
// Версия для кеш-инвалидации
const CACHE_VERSION = 'v2';
const STATIC_CACHE = `medical-consultation-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `medical-consultation-dynamic-${CACHE_VERSION}`;

// Файлы для статического кеширования
const STATIC_FILES = [
  '/',
  '/manifest.json',
  '/icon-192x192.png', 
  '/icon-512x512.png',
  '/apple-touch-icon.png'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('[SW] Installation complete');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

// Активация Service Worker  
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    Promise.all([
      // Очищаем старые кеши
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Немедленно берем контроль над всеми клиентами
      self.clients.claim()
    ]).then(() => {
      console.log('[SW] Activation complete, controlling all clients');
      
      // Уведомляем всех клиентов о том, что новый SW активен
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_UPDATED',
            message: 'Service Worker обновлен'
          });
        });
      });
    })
  );
});

// Стратегия кеширования для fetch запросов
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Кешируем API запросы с сетевым приоритетом
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Кешируем только успешные GET запросы
          if (request.method === 'GET' && response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback к кешу при отсутствии сети
          return caches.match(request);
        })
    );
    return;
  }

  // Для статических файлов - сначала кеш, потом сеть
  if (STATIC_FILES.includes(url.pathname)) {
    event.respondWith(
      caches.match(request)
        .then(response => response || fetch(request))
    );
    return;
  }

  // Для остальных запросов - стандартная обработка
  event.respondWith(
    caches.match(request)
      .then(response => response || fetch(request))
  );
});

// Обработка Push-уведомлений
self.addEventListener('push', (event) => {
  console.log('[SW] Push received');
  
  if (!event.data) {
    console.warn('[SW] Push event has no data');
    return;
  }

  try {
    const data = event.data.json();
    
    // Базовые настройки для всех уведомлений
    const options = {
      body: data.body || 'У вас новое уведомление',
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      tag: data.tag || 'notification',
      data: {
        ...data.data,
        timestamp: Date.now(),
        url: data.url || '/'
      },
      requireInteraction: false,
      silent: false,
      timestamp: Date.now()
    };

    // Проверяем, работаем ли мы на iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      // Для iOS упрощаем опции уведомления
      options.actions = undefined; // iOS не поддерживает actions в уведомлениях
      options.vibrate = undefined; // Вибрация может не работать
      
      // Устанавливаем requireInteraction в true для iOS
      options.requireInteraction = true;
      
      console.log('[SW] iOS detected, using simplified notification options');
    } else {
      // Для других платформ добавляем действия и вибрацию
      options.actions = [
        {
          action: 'open',
          title: 'Открыть',
          icon: '/icon-192x192.png'
        },
        {
          action: 'close', 
          title: 'Закрыть'
        }
      ];
      options.vibrate = [200, 100, 200];
    }

    // Специальная обработка для чатов
    if (data.type === 'chat_message') {
      options.tag = `chat-${data.data?.chat_id || 'unknown'}`;
      options.data.url = `/chats/${data.data?.chat_id || ''}`;
      options.actions = [
        {
          action: 'open_chat',
          title: 'Открыть чат',
          icon: '/icon-192x192.png'
        },
        {
          action: 'close',
          title: 'Закрыть'
        }
      ];
    }

    event.waitUntil(
      self.registration.showNotification(
        data.title || 'Medical Consultation', 
        options
      )
    );

  } catch (error) {
    console.error('[SW] Push notification error:', error);
    
    // Fallback уведомление при ошибке парсинга
    event.waitUntil(
      self.registration.showNotification('Medical Consultation', {
        body: 'У вас новое уведомление',
        icon: '/icon-192x192.png',
        tag: 'fallback'
      })
    );
  }
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const notificationData = event.notification.data || {};
  let targetUrl = '/';

  // Определяем URL для перехода
  if (event.action === 'open_chat') {
    targetUrl = `/chats/${notificationData.chat_id || ''}`;
  } else if (event.action === 'open' || !event.action) {
    targetUrl = notificationData.url || '/';
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // Ищем уже открытое окно приложения
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            // Фокусируемся на существующем окне и переходим к нужной странице
            return client.focus().then(() => {
              if ('navigate' in client) {
                return client.navigate(targetUrl);
              } else {
                return client.postMessage({
                  type: 'NOTIFICATION_CLICK',
                  url: targetUrl
                });
              }
            });
          }
        }
        
        // Если окно не найдено, открываем новое
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});

// Обработка сообщений от главного потока
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Skipping waiting and taking control');
    self.skipWaiting();
  }
});

// Обработка ошибок
self.addEventListener('error', (event) => {
  console.error('[SW] Error:', event.error);
});

// Обработка необработанных промисов
self.addEventListener('unhandledrejection', (event) => {
  console.error('[SW] Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

console.log('[SW] Service Worker script loaded');
