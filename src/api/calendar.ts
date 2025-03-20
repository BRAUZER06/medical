import axios, { AxiosResponse } from 'axios'
import axiosInstance from './instance'
import dayjs from 'dayjs'

// Интерфейс для доступного слота
export interface AvailabilitySlot {
	id: number
	doctor_id: number
	date: string
	start_time: string
	end_time: string
	booked: boolean
	created_at: string
	updated_at: string
}

// Интерфейс для отправки данных о доступных днях
export interface AvailabilityRequest {
	slots: {
		start: string
		end: string
	}[]
}

// Получение доступных слотов для записи
export const fetchAvailableSlots = async (
	doctorId: number,
	date: string
): Promise<AvailabilitySlot[]> => {
	try {
		const response: AxiosResponse<AvailabilitySlot[]> = await axiosInstance.get(
			'/availabilities',
			{
				params: {
					doctor_id: doctorId,
					date: date,
				},
			}
		)
		return response.data
	} catch (error) {
		console.error('Ошибка при получении доступных слотов:', error)
		throw error
	}
}

// Отправка данных о доступных днях
export const setAvailabilities = async (
	data: AvailabilityRequest
): Promise<void> => {
	try {
		const response: AxiosResponse<void> = await axiosInstance.post(
			'/availabilities',
			data
		)
		console.log('Данные успешно отправлены:', response.data)
	} catch (error) {
		console.error('Ошибка при отправке данных:', error)
		throw error
	}
}

export interface MyAvailabilitiesResponse {
	[date: string]: AvailabilitySlot[]
}

export const getMyAvailabilities =
	async (): Promise<MyAvailabilitiesResponse> => {
		try {
			const response: AxiosResponse<MyAvailabilitiesResponse> =
				await axiosInstance.get('/my_availabilities')
			return response.data
		} catch (error) {
			console.error('Ошибка при получении доступных слотов:', error)
			throw error
		}
	}
