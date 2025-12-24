
import axios from 'axios'

const axiosClient = axios.create({
	baseURL: (import.meta.env.VITE_API_BASE_URL || 'https://only-doc.ru') + '/api',
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	},
})

export default axiosClient
