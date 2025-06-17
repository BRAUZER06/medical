const TOKEN_KEY = 'jwt_token'

export const getToken = (): string | null => {
	const token = localStorage.getItem('jwt_token')
	return token
}

export const setToken = (token: string) => {
	console.log('[setToken]', token)
	localStorage.setItem('jwt_token', token)
}

export const removeToken = () => {
	try {
		localStorage.removeItem(TOKEN_KEY)
	} catch (error) {
		console.error('Error removing token from localStorage:', error)
	}
}

export const isAuthenticated = (): boolean => {
	const token = getToken()
	if (!token) return false
	
	try {
		// Простая проверка JWT структуры
		const parts = token.split('.')
		if (parts.length !== 3) return false
		
		// Декодируем payload для проверки срока действия
		const payload = JSON.parse(atob(parts[1]))
		const currentTime = Math.floor(Date.now() / 1000)
		
		// Если токен истёк, удаляем его
		if (payload.exp && payload.exp < currentTime) {
			removeToken()
			return false
		}
		
		return true
	} catch (error) {
		// Если токен невалидный, удаляем его
		removeToken()
		return false
	}
}
