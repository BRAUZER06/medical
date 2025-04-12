import { AxiosResponse } from 'axios'

import axiosInstance from './instance'
import { data } from 'react-router-dom'

export const getPatientRecord = async (): Promise<any> => {
	try {
	const response = await axiosInstance.get(`/my_appointments`)
  	return response.data
	} catch (error) {
		console.error(':', error)
		throw error
	}
}

export const updatePatientRecord = async (
	id: string,
	notes: string
): Promise<any> => {
	try {
		await axiosInstance.patch(`/appointments/${id}`, { notes })
	} catch (error) {
		console.error(':', error)
		throw error
	}
}
export const deletedPatientRecord = async (id: string): Promise<any> => {
	try {
		await axiosInstance.delete(`/appointments/${id}/cancel`)
	} catch (error) {
		console.error(':', error)
		throw error
	}
}
