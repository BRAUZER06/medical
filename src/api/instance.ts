import axios from 'axios'
import { getToken } from '../utils/jwt'

const API_BASE_URL = 'https://e6ee-45-153-24-10.ngrok-free.app'

const axiosInstance = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		'ngrok-skip-browser-warning': 'true',
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


export default axiosInstance
