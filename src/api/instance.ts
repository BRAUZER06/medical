import axios from 'axios'
import { getToken } from '../utils/jwt'

const API_BASE_URL = 'https://99a6-138-124-187-109.ngrok-free.app'

const axiosInstance = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',

		'ngrok-skip-browser-warning': 'true',
	},
})

axiosInstance.interceptors.request.use(config => {
	const token = getToken()

	if (!config.headers) {
		config.headers = {}
	}

	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

export default axiosInstance
