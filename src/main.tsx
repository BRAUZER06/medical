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
