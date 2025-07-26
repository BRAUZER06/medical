self.addEventListener('push', event => {
  let data = {};
  if (event.data) {
    data = event.data.json();
  }
  const title = data.title || 'Новое уведомление';
  const options = {
    body: data.body || '',
    data: data.data || '/',
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data;
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      for (const client of windowClients) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
