import { Provider } from 'react-redux'
import AppRouter from './pages/AppRouter'
import store from './store'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeAuth, loadUserData } from './features/Authentication/authSlice'
import { RootState, AppDispatch } from './store'

// Компонент для инициализации аутентификации
const AuthInitializer = () => {
	const dispatch = useDispatch<AppDispatch>()
	const { isAuthenticated, token } = useSelector((state: RootState) => state.auth)
	
	useEffect(() => {
		dispatch(initializeAuth())
		
		// Если есть токен, но нет данных пользователя, загружаем их
		if (token && isAuthenticated) {
			dispatch(loadUserData())
		}
	}, [dispatch, token, isAuthenticated])
	
	return null
}

const theme = createTheme({
	palette: {
		primary: {
			// main: '#5dd7e8',
			main: '#01c9e5',
			dark: '#84E1EC',
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					backgroundColor: '#5dd7e8',
					'&:hover': {
						backgroundColor: '#84E1EC',
					},
				},
			},
		},
		MuiTextField: {
			styleOverrides: {
				root: {
					'& .MuiOutlinedInput-root': {
						'& fieldset': {
							borderColor: '#5dd7e8',
						},
						'&:hover fieldset': {
							borderColor: '#84E1EC',
						},
						'&.Mui-focused fieldset': {
							borderColor: '#84E1EC',
						},
					},
				},
			},
		},
	},
})
const App = () => {
	const queryClient = new QueryClient()
	
		return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Provider store={store}>
					<AuthInitializer />
					<AppRouter />
				</Provider>
			</ThemeProvider>
		</QueryClientProvider>
	)
}

export default App
