import { StrictMode, useEffect } from 'react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import App from './App'
import store from './store'
import { registerServiceWorker } from './utils/pushNotifications'

const queryClient = new QueryClient()

// Регистрируем Service Worker при загрузке приложения
registerServiceWorker();

createRoot(document.getElementById('root')!).render(
	<Provider store={store}>
		<QueryClientProvider client={queryClient}>
			<App />
		</QueryClientProvider>
	</Provider>
)
