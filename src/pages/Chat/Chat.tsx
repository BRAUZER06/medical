import React, { useEffect, useRef, useState } from 'react'
import {
	Box,
	Typography,
	IconButton,
	TextField,
	Button,
	Avatar,
	CircularProgress,
} from '@mui/material'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import CloseIcon from '@mui/icons-material/Close'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate, useParams } from 'react-router-dom'
import { getChatMessage, createMessage, getAllChats } from '../../api/chats'
import { fetchCurrentUser, User } from '../../api/profile'
import { createConsumer } from '@rails/actioncable'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { getFileIcon, getFileType } from '../../utils/getFileIcon'
import { getFullUrl } from '../../utils/getFullUrl'
import { getAbsoluteUrl } from '../../utils/getAbsoluteUrl'

dayjs.locale('ru')

const cable = createConsumer(
	'wss://8f95-2001-41d0-700-4164-00.ngrok-free.app/cable'
)

const subscribeToChat = (chatId: number, onReceived: (data: any) => void) => {
	return cable.subscriptions.create(
		{ channel: 'ChatChannel', chat_id: chatId },
		{
			connected() {
				console.log(`✅ Подключено к WebSocket чата #${chatId}`)
			},
			disconnected() {
				console.log(`❌ Отключено от WebSocket чата #${chatId}`)
			},
			received(data: any) {
				console.log('📨 Новое сообщение через WebSocket:', data)
				onReceived(data)
			},
		}
	)
}

export default function Chat() {
	const navigate = useNavigate()
	const { id: chatIdParam } = useParams()
	const chatId = Number(chatIdParam)

	const [messages, setMessages] = useState<any[]>([])
	const [newMessage, setNewMessage] = useState('')
	const [attachedFiles, setAttachedFiles] = useState<File[]>([])
	const [selectedMessageType, setSelectedMessageType] = useState<
		'text' | 'image' | 'file'
	>('text')

	const subscriptionRef = useRef<any>(null)
	const scrollRef = useRef<HTMLDivElement>(null)

	const { data: currentUser, isLoading: isCurrentUserLoading } = useQuery<User>(
		{
			queryKey: ['currentUser'],
			queryFn: fetchCurrentUser,
		}
	)

	const { data: chats, isLoading: isChatsLoading } = useQuery({
		queryKey: ['chats'],
		queryFn: getAllChats,
		enabled: !!chatId,
	})

	const chatPartner = chats?.find(chat => chat.id === chatId)?.user

	useEffect(() => {
		if (!chatId) return

		getChatMessage(chatId).then(data => {
			setMessages(data)
		})

		subscriptionRef.current = subscribeToChat(chatId, data => {
			setMessages(prev => [...prev, data])
		})

		return () => {
			subscriptionRef.current?.unsubscribe()
		}
	}, [chatId])

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	const handleSend = async () => {
		if (!chatId || (!newMessage.trim() && attachedFiles.length === 0)) return

		const formData = new FormData()
		formData.append(
			'message_type',
			attachedFiles.length > 0 ? selectedMessageType : 'text'
		)

		if (attachedFiles.length > 0) {
			attachedFiles.forEach(file => {
				formData.append('attachments[]', file)
			})
		}

		if (newMessage.trim()) {
			formData.append('content', newMessage)
		}

		await createMessage(chatId, formData)

		setNewMessage('')
		setAttachedFiles([])
	}

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files
		if (files && files.length > 0) {
			const newFiles = Array.from(files)
			setAttachedFiles(prev => [...prev, ...newFiles])
			setSelectedMessageType(
				newFiles.some(file => file.type.startsWith('image/')) ? 'image' : 'file'
			)
		}
	}

	const handleRemoveFile = (index: number) => {
		setAttachedFiles(prev => prev.filter((_, i) => i !== index))
	}

	const handleNavigateToProfile = () => {
		if (!chatPartner) return
		if (chatPartner.role === 'patient') {
			navigate(`/patients/${chatPartner.id}`)
		} else if (chatPartner.role === 'doctor') {
			navigate(`/doctors/${chatPartner.id}`)
		}
	}

	if (isCurrentUserLoading || isChatsLoading) {
		return (
			<Box
				sx={{
					height: '100vh',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<CircularProgress />
			</Box>
		)
	}

	return (
		<Box sx={{ height: '91vh', display: 'flex', flexDirection: 'column' }}>
			{/* Верхняя панель */}
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					px: 2,
					py: 1,
					borderBottom: '1px solid #ccc',
					backgroundColor: '#f9f9f9',
					flexShrink: 0,
				}}
			>
				<IconButton onClick={() => navigate(-1)}>
					<ArrowBackIcon />
				</IconButton>
				<Avatar sx={{ mx: 1 }} />
				<Box>
					<Typography
						variant='h6'
						noWrap
						sx={{ cursor: chatPartner ? 'pointer' : 'default' }}
						onClick={chatPartner ? handleNavigateToProfile : undefined}
					>
						{chatPartner
							? `${chatPartner.first_name} ${chatPartner.last_name}`
							: 'Чат'}
					</Typography>
					{chatPartner?.specialization && (
						<Typography
							variant='caption'
							sx={{ display: 'block', fontWeight: 400, fontSize: '0.75rem' }}
						>
							{chatPartner.specialization}
						</Typography>
					)}
				</Box>
			</Box>

			{/* Сообщения */}
			<Box
				sx={{
					flexGrow: 1,
					overflowY: 'auto',
					p: 2,
					display: 'flex',
					flexDirection: 'column',
					gap: 1.5,
					backgroundColor: '#f5f5f5',
				}}
			>
				{messages.map(msg => {
					const isCurrentUser = msg.sender?.id === currentUser?.id

					return (
						<Box
							key={msg.id || `${msg.sender?.id}-${msg.created_at}`}
							sx={{
								alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
								backgroundColor: isCurrentUser ? '#1976d2' : '#e0e0e0',
								color: isCurrentUser ? 'white' : 'black',
								px: 2,
								py: 1,
								borderRadius: 2,
								maxWidth: '80%',
								whiteSpace: 'pre-wrap',
							}}
						>
							{msg.message_type === 'text' && (
								<Typography variant='body2' sx={{ wordBreak: 'break-word' }}>
									{msg.content}
								</Typography>
							)}

							{msg.attachments?.map(att => {
								const fileExtension = att.name?.split('.').pop()?.toLowerCase()
								const fileType =
									att.type ||
									(fileExtension ? getFileType(fileExtension) : 'file')

								if (fileType === 'image') {
									return (
										<Box
											key={att.url}
											sx={{ mt: 1, cursor: 'pointer', overflow: 'hidden' }}
										>
											<img
												src={getAbsoluteUrl(att.url)}
												alt={att.name}
												style={{
													maxWidth: '100%',
													minHeight: '150px',
													objectFit: 'cover',
													borderRadius: '8px',
													backgroundColor: '#f0f0f0',
												}}
												onClick={() => window.open(att.url, '_blank')}
											/>

											<Typography variant='caption' display='block'>
												{att.name}
											</Typography>
										</Box>
									)
								}

								return (
									<Box key={att.url} sx={{ mt: 1 }}>
										<a
											href={getAbsoluteUrl(att.url)}
											target='_blank'
											rel='noopener noreferrer'
											style={{ display: 'block', textAlign: 'center' }}
										>
											{getFileIcon(fileExtension || '')}
											<Typography variant='caption' display='block'>
												{att.name}
											</Typography>
										</a>
									</Box>
								)
							})}
							<Typography
								variant='caption'
								sx={{
									display: 'block',
									textAlign: isCurrentUser ? 'right' : 'left',
									mt: 0.5,
									opacity: 0.7,
								}}
							>
								{dayjs(msg.created_at).format('HH:mm · DD MMM')}
							</Typography>
						</Box>
					)
				})}

				<div ref={scrollRef} />
			</Box>

			{/* Прикрепленные файлы */}
			{attachedFiles.length > 0 && (
				<Box
					sx={{
						p: 1,
						borderTop: '1px solid #eee',
						backgroundColor: '#f9f9f9',
						display: 'flex',
						flexWrap: 'wrap',
						gap: 1,
						overflowX: 'auto',
						height: '320px',
					}}
				>
					{attachedFiles.map((file, index) => (
						<Box
							key={index}
							sx={{
								position: 'relative',
								minWidth: 100,
								p: 1,
								border: '1px solid #ddd',
								borderRadius: 1,
								backgroundColor: 'white',
								maxWidth: '80px',
							}}
						>
							{file.type.startsWith('image/') ? (
								<img
									src={URL.createObjectURL(file)}
									alt={file.name}
									style={{
										width: '100%',
										height: 60,
										objectFit: 'cover',
										borderRadius: 4,
									}}
								/>
							) : (
								<Box sx={{ textAlign: 'center' }}>
									{getFileIcon(file.name.split('.').pop() || '')}
								</Box>
							)}
							<Typography
								variant='caption'
								sx={{
									display: 'block',
									whiteSpace: 'nowrap',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									mt: 0.5,
								}}
							>
								{file.name}
							</Typography>
							<IconButton
								size='small'
								sx={{
									position: 'absolute',
									top: -8,
									right: -8,
									backgroundColor: 'white',
									boxShadow: 1,
									'&:hover': { backgroundColor: '#f5f5f5' },
								}}
								onClick={() => handleRemoveFile(index)}
							>
								<CloseIcon fontSize='small' />
							</IconButton>
						</Box>
					))}
				</Box>
			)}

			{/* Ввод сообщения */}
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
					disabled={!newMessage.trim() && attachedFiles.length === 0}
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
		</Box>
	)
}
