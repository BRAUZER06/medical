import axios from 'axios'
import { getToken, removeToken } from '../utils/jwt'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://only-doc.ru/api'

const axiosInstance = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
})

axiosInstance.interceptors.request.use(config => {
	const token = getToken() // теперь всегда будет актуальный
	if (token) {
		config.headers = {
			...config.headers,
			Authorization: `Bearer ${token}`,
		}
	}
	return config
})

// Добавляем интерцептор для обработки ошибок аутентификации
axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Если получили 401, удаляем токен
			removeToken()
			
			// Редиректим на логин только если мы НЕ на странице логина/регистрации
			const currentPath = window.location.pathname
			if (currentPath !== '/login' && currentPath !== '/signup') {
				window.location.href = '/login'
			}
		}
		return Promise.reject(error)
	}
)

export default axiosInstance
