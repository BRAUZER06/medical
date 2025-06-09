import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { getToken } from '../../utils/jwt'
import { fetchCurrentUser } from '../../api/profile'

// Async thunk для загрузки данных пользователя
export const loadUserData = createAsyncThunk(
	'auth/loadUserData',
	async () => {
		const response = await fetchCurrentUser()
		return response
	}
)

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
	isLoading: boolean
}

// Инициализируем состояние с проверкой localStorage
const savedToken = getToken()
const initialState: AuthState = {
	user: null,
	token: savedToken,
	isAuthenticated: !!savedToken,
	isLoading: false,
}

// Создаем slice
const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		// Инициализация состояния при загрузке приложения
		initializeAuth(state) {
			const token = getToken()
			if (token) {
				state.token = token
				state.isAuthenticated = true
			} else {
				state.token = null
				state.isAuthenticated = false
				state.user = null
			}
		},
		// Устанавливаем пользователя и токен при успешной авторизации
		setUser(state, action: PayloadAction<{ user: User; token: string }>) {
			state.user = action.payload.user
			state.token = action.payload.token
			state.isAuthenticated = true
	
			localStorage.setItem('jwt_token', action.payload.token) 
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
		
			localStorage.removeItem('jwt_token') 
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loadUserData.pending, (state) => {
				state.isLoading = true
			})
			.addCase(loadUserData.fulfilled, (state, action) => {
				state.isLoading = false
				if (action.payload) {
					state.user = {
						id: String(action.payload.id),
						email: action.payload.email,
						role: action.payload.role,
						firstName: action.payload.first_name,
						lastName: action.payload.last_name,
						middleName: action.payload.middle_name,
					}
					state.isAuthenticated = true
				}
			})
			.addCase(loadUserData.rejected, (state) => {
				state.isLoading = false
				state.user = null
				state.token = null
				state.isAuthenticated = false
				localStorage.removeItem('jwt_token')
			})
	},
})

// Экспортируем actions
export const { initializeAuth, setUser, updateUser, logout } = authSlice.actions

// Экспортируем reducer
export default authSlice.reducer
