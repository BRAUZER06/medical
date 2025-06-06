
import axios, { AxiosResponse } from 'axios'; 
import axiosInstance from './instance'; 



export interface User {
	id: number
	avatar_url: string | null
	email: string
	created_at: string
	updated_at: string
	role: 'doctor' | 'patient'
	workplaces?: string[]
	last_name: string
	first_name: string
	middle_name?: string
	phone: string
	date_of_birth?: string
	gender?: string
	specializations: string[]
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
	specializations: string[]
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
	userData: UserUpdateData | FormData
): Promise<User> => {
	try {
		const response: AxiosResponse<{ data: User }> = await axiosInstance.patch(
			'/current_user',
			userData,
			userData instanceof FormData
				? { headers: { 'Content-Type': 'multipart/form-data' } }
				: undefined
		)
		return response.data.data
	} catch (error) {
		console.error('Ошибка при обновлении данных пользователя:', error)
		throw error
	}
}










export const SPECIALIZATIONS = {
	therapist: 'Терапевт',
	pediatrician: 'Педиатр',
	geriatrician: 'Гериатр',
	general_practitioner: 'Врач общей практики / Семейный врач',
	cardiologist: 'Кардиолог',
	rheumatologist: 'Ревматолог',
	angiologist: 'Ангиолог',
	vascular_surgeon: 'Сосудистый хирург',
	neurologist: 'Невролог',
	psychiatrist: 'Психиатр',
	psychotherapist: 'Психотерапевт',
	psychologist: 'Психолог',
	epileptologist: 'Эпилептолог',
	somnologist: 'Сомнолог',
	orthopedist: 'Ортопед',
	traumatologist: 'Травматолог',
	vertebrologist: 'Вертебролог',
	ophthalmologist: 'Офтальмолог',
	otolaryngologist: 'Отоларинголог / ЛОР',
	surdologist: 'Сурдолог',
	audiologist: 'Аудиолог',
	dental_therapist: 'Стоматолог-терапевт',
	orthodontist: 'Ортодонт',
	dental_surgeon: 'Хирург-стоматолог',
	periodontist: 'Пародонтолог',
	hygienist: 'Гигиенист',
	gynecologist: 'Гинеколог',
	urologist: 'Уролог',
	andrologist: 'Андролог',
	reproductologist: 'Репродуктолог',
	sexologist: 'Сексолог',
	pediatric_neurologist: 'Детский невролог',
	pediatric_cardiologist: 'Детский кардиолог',
	pediatric_ent: 'Детский ЛОР',
	neonatologist: 'Неонатолог',
	pediatric_gastroenterologist: 'Детский гастроэнтеролог',
	endocrinologist: 'Эндокринолог',
	hematologist: 'Гематолог',
	dietitian: 'Диетолог',
	nutritionist: 'Нутрициолог',
	infectious_disease_specialist: 'Инфекционист',
	immunologist: 'Иммунолог',
	allergist: 'Аллерголог',
	dermatovenerologist: 'Дерматовенеролог',
	dermatologist: 'Дерматолог',
	trichologist: 'Трихолог',
	cosmetologist: 'Косметолог',
	podiatrist: 'Подолог',
	surgeon: 'Хирург',
	proctologist: 'Проктолог',
	oncologist: 'Онколог',
	mammologist: 'Маммолог',
	plastic_surgeon: 'Пластический хирург',
	maxillofacial_surgeon: 'Челюстно-лицевой хирург',
	gastroenterologist: 'Гастроэнтеролог',
	pulmonologist: 'Пульмонолог',
	hepatologist: 'Гепатолог',
	coloproctologist: 'Колопроктолог',
	anesthesiologist: 'Анестезиолог',
	physiotherapist: 'Физиотерапевт',
	rehabilitologist: 'Реабилитолог',
	manual_therapist: 'Мануальный терапевт',
	medical_geneticist: 'Медицинский генетик',
	forensic_expert: 'Судебно-медицинский эксперт',
} as const

export type SpecializationKey = keyof typeof SPECIALIZATIONS
export type SpecializationLabel = (typeof SPECIALIZATIONS)[SpecializationKey]

export const SPECIALIZATION_OPTIONS = Object.entries(SPECIALIZATIONS).map(
	([value, label]) => ({ value, label })
)