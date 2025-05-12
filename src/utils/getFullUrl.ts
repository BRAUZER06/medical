import { API_BASE_URL } from "../api/instance";

export const getFullUrl = (url: string) =>
	url.startsWith('http') ? url : `${API_BASE_URL}${url}`
