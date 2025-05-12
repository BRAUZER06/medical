import { AxiosResponse } from 'axios'
import axiosInstance from './instance'

//получить все чаты
export const getAllChats = async (): Promise<any> => {
	try {
		const response: AxiosResponse<any> = await axiosInstance.get('/chats')
		return response.data
	} catch (error) {
		console.error('Ошибка при получении списка врачей:', error)
		throw error
	}
}

// создать или открыть чат
export const createOrFetchChat = async (user_id: number): Promise<any> => {
	try {
		const response: AxiosResponse<any> = await axiosInstance.post(
			'/chats',

			{ user_id: user_id }
		)
		return response.data
	} catch (error) {
		console.error('Ошибка при получении списка врачей:', error)
		throw error
	}
}

//получить сообщение чата
export const getChatMessage = async (chat_id: number): Promise<any> => {
	try {
		const response: AxiosResponse<any> = await axiosInstance.get(
			`/chats/${chat_id}/messages`
		)
		return response.data
	} catch (error) {
		console.error('Ошибка при получении списка врачей:', error)
		throw error
	}
}

//добавить сообщение в чат 
// исправленный createMessage
export const createMessage = async (chat_id: number, payload: any): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await axiosInstance.post(
      `/chats/${chat_id}/messages`,
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data', // 👈 обязательно
        },
      }
    )
    return response.data
  } catch (error) {
    console.error('Ошибка при отправке сообщения:', error)
    throw error
  }
}


// отправить картинку
export const uploadImageMessage = async (chat_id: number, file: File): Promise<any> => {
  const formData = new FormData()
  formData.append('message_type', 'image')
  formData.append('image', file)

  const response = await axiosInstance.post(`/chats/${chat_id}/messages`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return response.data
}
