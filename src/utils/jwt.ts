const TOKEN_KEY = 'jwt_token'

export const getToken = (): string | null => {
	try {
		return localStorage.getItem(TOKEN_KEY)
	} catch (error) {
		console.error('Error getting token from localStorage:', error)
		return null
	}
}

export const setToken = (token: string) => {
	try {
		localStorage.setItem(TOKEN_KEY, token)
	} catch (error) {
		console.error('Error setting token in localStorage:', error)
	}
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
