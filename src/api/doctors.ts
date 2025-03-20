import { AxiosResponse } from 'axios'
import axiosInstance from './instance'

export interface DoctorAttributes {
	id: number
	email: string | null
	created_at: string
	updated_at: string
	role: string | null
	last_name: string | null
	first_name: string | null
	middle_name: string | null
	phone: string | null
	date_of_birth: string | null
	gender: string | null
	specialization: string | null
	bio: string | null
	experience: string | null
	description_for_patient: string | null
	medical_history: string | null
	created_date: string | null
	avatar_url: string | null
}

export interface DoctorResponseItem {
	id: string
	type: 'user'
	attributes: DoctorAttributes
}

export interface DoctorsResponse {
	data: DoctorResponseItem[]
}

// Получить конкретного доктора по ID
export const getDoctorById = async (id: string): Promise<DoctorsResponse> => {
	try {
		const response: AxiosResponse<DoctorsResponse> = await axiosInstance.get(
			`/doctors/${id}`
		)
		return response.data
	} catch (error) {
		console.error('Ошибка при получении данных врача:', error)
		throw error
	}
}

// Получить всех докторов
export const getAllDoctors = async (): Promise<DoctorsResponse> => {
	try {
		const response: AxiosResponse<DoctorsResponse> = await axiosInstance.get(
			'/doctors'
		)
		return response.data
	} catch (error) {
		console.error('Ошибка при получении списка врачей:', error)
		throw error
	}
}
