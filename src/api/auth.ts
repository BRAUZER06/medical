import axiosInstance from './instance'
import { setToken } from '../utils/jwt'

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
		const response = await axiosInstance.post('/signup', { user })	
		return response
	} catch (error) {
		console.error('Ошибка регистрации:', error)
		throw error
	}
}

export const loginUser = async (credentials: LoginCredentials) => {
	try {
		const response = await axiosInstance.post('/login', {
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
