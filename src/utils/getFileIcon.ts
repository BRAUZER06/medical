export const getFileIcon = (ext?: string) => {
	if (!ext) return '📄'

	const icons: Record<string, string> = {
		doc: '📝',
		docx: '📝',
		xls: '📊',
		xlsx: '📊',
		pdf: '📕',
		zip: '🗜',
		rar: '🗜',
		'7z': '🗜',
		txt: '📄',
		ppt: '📑',
		pptx: '📑',
	}

	return icons[ext] || '📄'
}

export const getFileType = (ext: string) => {
	const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp']
	if (imageTypes.includes(ext)) return 'image'
	return 'file'
}
