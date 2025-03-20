import SecureStorage from 'react-secure-storage'

const TOKEN_KEY = 'jwt_token'

export const getToken = (): string | null => {
	return SecureStorage.getItem(TOKEN_KEY) as string | null
}

export const setToken = (token: string) => {
	SecureStorage.setItem(TOKEN_KEY, token)
}

export const removeToken = () => {
	SecureStorage.removeItem(TOKEN_KEY)
}

export const isAuthenticated = (): boolean => !!getToken()
