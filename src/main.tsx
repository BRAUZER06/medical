import { StrictMode } from 'react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import App from './App'
import store from './store'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
   <Provider store={store}>
	  <QueryClientProvider client={queryClient}>
		 <App />
	  </QueryClientProvider>
   </Provider>
)

// Регистрация Service Worker и подписка на Web Push уведомления
async function registerServiceWorkerAndPush() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
	try {
	  const registration = await navigator.serviceWorker.register('/service-worker.js');
	  // Получаем публичный VAPID ключ от сервера
	  const res = await fetch('/api/vapid_public_key');
	  const { public_key } = await res.json();
	  const toUint8Array = (base64: string) => {
		const padding = '='.repeat((4 - (base64.length % 4)) % 4);
		const safe = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
		const rawData = atob(safe);
		return new Uint8Array([...rawData].map(ch => ch.charCodeAt(0)));
	  };
	  const subscription = await registration.pushManager.subscribe({
		userVisibleOnly: true,
		applicationServerKey: toUint8Array(public_key)
	  });
	  // Отправляем подписку на сервер
	  await fetch('/api/push_subscriptions', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(subscription)
	  });
	} catch (err) {
	  console.error('Ошибка регистрации Service Worker или Push подписки:', err);
	}
  }
}
registerServiceWorkerAndPush();
