// public/sw.js
self.addEventListener('push', function(event) {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: data.icon || '/logo.png',
    badge: data.badge || '/logo.png',
    data: data.data,
    actions: [
      { action: 'open_chat', title: 'Открыть чат' },
      { action: 'close', title: 'Закрыть' }
    ],
    requireInteraction: false,
    vibrate: [200, 100, 200]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  if (event.action === 'open_chat') {
    event.waitUntil(
      clients.openWindow(`/chats/${event.notification.data.chat_id}`)
    );
  } else if (event.action === 'close') {
    // Просто закрыть уведомление
  } else {
    // Клик по самому уведомлению - открыть чат
    event.waitUntil(
      clients.openWindow(`/chats/${event.notification.data.chat_id}`)
    );
  }
});
