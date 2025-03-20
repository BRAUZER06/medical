import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import secureStorage from 'react-secure-storage' // Импортируем secureStorage

// Определяем типы для пользователя
interface User {
	id: string
	email: string
	role: 'doctor' | 'patient'
	firstName: string
	lastName: string
	middleName?: string // Опциональное поле
}

// Определяем тип для состояния аутентификации
interface AuthState {
	user: User | null
	token: string | null
	isAuthenticated: boolean
}

// Начальное состояние
const initialState: AuthState = {
	user: null,
	token: null,
	isAuthenticated: false,
}

// Создаем slice
const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		// Устанавливаем пользователя и токен при успешной авторизации
		setUser(state, action: PayloadAction<{ user: User; token: string }>) {
			state.user = action.payload.user
			state.token = action.payload.token
			state.isAuthenticated = true
			localStorage.setItem('token', action.payload.token) 
			secureStorage.setItem('jwt_token', action.payload.token) 
		},
		// Обновляем данные пользователя
		updateUser(state, action: PayloadAction<Partial<User>>) {
			if (state.user) {
				state.user = { ...state.user, ...action.payload }
			}
		},
		// Выход из системы
		logout(state) {
			state.user = null
			state.token = null
			state.isAuthenticated = false
			localStorage.removeItem('token') 
			secureStorage.removeItem('jwt_token') 
		},
	},
})

// Экспортируем actions
export const { setUser, updateUser, logout } = authSlice.actions

// Экспортируем reducer
export default authSlice.reducer
