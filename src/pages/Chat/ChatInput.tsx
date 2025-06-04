import { Box, IconButton, TextField, Button } from '@mui/material'
import AttachFileIcon from '@mui/icons-material/AttachFile'

export const ChatInput = ({
	newMessage,
	setNewMessage,
	handleSend,
	handleFileChange,
	attachedFiles,
}: {
	newMessage: string
	setNewMessage: (value: string) => void
	handleSend: () => void
	handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	attachedFiles: File[]
}) => {
	return (
		<Box
			sx={{
				p: 2,
				borderTop: '1px solid #ccc',
				backgroundColor: 'white',
				display: 'flex',
				alignItems: 'center',
				gap: 1,
				flexShrink: 0,
			}}
		>
			<input
				type='file'
				id='file-input'
				multiple
				style={{ display: 'none' }}
				onChange={handleFileChange}
			/>
			<IconButton
				onClick={() => document.getElementById('file-input')?.click()}
			>
				<AttachFileIcon />
			</IconButton>

			<TextField
				placeholder='Напишите сообщение...'
				fullWidth
				variant='outlined'
				size='small'
				value={newMessage}
				onChange={e => setNewMessage(e.target.value)}
				sx={{
					'& .MuiOutlinedInput-root': {
						borderRadius: 3,
						backgroundColor: '#f1f1f1',
						px: 1.5,
						py: 1,
					},
				}}
			/>

			<Button
				variant='contained'
				onClick={handleSend}
				disabled={newMessage.trim() === '' && attachedFiles.length === 0}
				sx={{
					borderRadius: 3,
					textTransform: 'none',
					px: 3,
					height: '100%',
				}}
			>
				Отправить
			</Button>
		</Box>
	)
}
