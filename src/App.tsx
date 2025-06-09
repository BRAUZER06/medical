import { Provider } from 'react-redux'
import AppRouter from './pages/AppRouter'
import store from './store'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { getToken } from './utils/jwt'
import AppInitializer from './pages/AppInitializer'

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
			const token = getToken()

			
	const queryClient = new QueryClient()
	
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Provider store={store}>
					<AppInitializer>
						<AppRouter />
					</AppInitializer>
				</Provider>
			</ThemeProvider>
		</QueryClientProvider>
	)
}

export default App

