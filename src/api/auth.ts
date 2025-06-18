import axios from 'axios'
import { setToken } from '../utils/jwt'

// Отдельный instance для аутентификации (без /api/ префикса)
const authInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'https://only-doc.ru',
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
})

interface UserRegistrationData {
	email: string
	password: string
	last_name: string
	first_name: string
	middle_name?: string
	role: 1 | 0
}

interface LoginCredentials {
	email: string
	password: string
}

export const registerUser = async (user: UserRegistrationData) => {
	try {
		const response = await authInstance.post('/signup', { user })	
		return response
	} catch (error) {
		console.error('Ошибка регистрации:', error)
		throw error
	}
}

export const loginUser = async (credentials: LoginCredentials) => {
	try {
		const response = await authInstance.post('/login', {
			user: { ...credentials },
		})

		const token = response.headers['authorization']

		if (token && token.startsWith('Bearer ')) {
			const extractedToken = token.split(' ')[1]
			setToken(extractedToken)
		} else {
			console.warn(' Токен не найден ')
		}

		return response.data
	} catch (error: any) {
		console.error('Ошибка авторизации:', error.response?.data || error.message)
		throw error
	}
}
