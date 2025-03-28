
import axios, { AxiosResponse } from 'axios'; 
import axiosInstance from './instance'; 

export interface User {
	id: number
	avatar_url:string |null
	email: string
	created_at: string
	updated_at: string
	role: 'doctor' | 'patient'
	last_name: string
	first_name: string
	middle_name?: string
	phone: string
	date_of_birth?: string
	gender?: string
	specialization?: string
	bio?: string
	experience?: string | null
	description_for_patient?: string | null
	medical_history?: string | null
	created_date: string
}

export interface UserUpdateData {
	first_name?: string
	last_name?: string
	middle_name?: string
	phone?: string
	date_of_birth?: string
	gender?: string
	specialization?: string
	bio?: string
}
// Получение данных текущего пользователя
export const fetchCurrentUser = async (): Promise<User> => {
	try {
		const response: AxiosResponse<User> = await axiosInstance.get(
			'/current_user'
		)
		return response.data // Предполагаем, что сервер возвращает данные напрямую
	} catch (error) {
		console.error('Ошибка при загрузке данных пользователя:', error)
		throw error
	}
}

// Обновление данных пользователя
export const updateUserProfile = async (
	userData: UserUpdateData
): Promise<User> => {
	try {
		const response: AxiosResponse<{ data: User }> = await axiosInstance.patch(
			'/current_user',
			{
				user: userData,
			}
		)
		return response.data.data // Предполагаем, что сервер возвращает данные вложенными в объект data
	} catch (error) {
		console.error('Ошибка при обновлении данных пользователя:', error)
		throw error
	}
}