const TOKEN_KEY = 'jwt_token'

export const getToken = (): string | null => {
	const token = localStorage.getItem('jwt_token')
	console.log('[getToken]', token)
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
	return !!getToken()
}
