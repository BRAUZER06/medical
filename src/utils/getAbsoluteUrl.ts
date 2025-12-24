export const getAbsoluteUrl = (path: string): string => {
	if (!path) return ''
	if (path.startsWith('http')) return path
	return `${import.meta.env.VITE_API_BASE_URL || 'https://only-doc.ru'}${path}`
}
