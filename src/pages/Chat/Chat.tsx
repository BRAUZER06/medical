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
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate, useParams } from 'react-router-dom'
import { getChatMessage, createMessage, getAllChats } from '../../api/chats'
import { createConsumer } from '@rails/actioncable'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'

dayjs.locale('ru')

// 👤 Текущий пользователь (заглушка, заменить на auth)
const currentUser = {
	id: 37,
	role: 'patient',
}

// WebSocket
const cable = createConsumer('wss://bc83-45-153-24-10.ngrok-free.app/cable')

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
	const subscriptionRef = useRef<any>(null)
	const scrollRef = useRef<HTMLDivElement>(null)

	// Получаем список чатов
	const { data: chats, isLoading: isChatsLoading } = useQuery({
		queryKey: ['chats'],
		queryFn: getAllChats,
		enabled: !!chatId,
	})

	// Ищем собеседника по chatId
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
		if (!newMessage.trim() || !chatId) return
		await createMessage(chatId, newMessage)
		setNewMessage('')
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
				<Typography variant='h6' noWrap>
					{isChatsLoading ? (
						<CircularProgress size={18} />
					) : chatPartner ? (
						<>
							{chatPartner.first_name} {chatPartner.last_name}
							{chatPartner.specialization && (
								<Typography
									variant='caption'
									component='span'
									sx={{
										display: 'block',
										fontWeight: 400,
										fontSize: '0.75rem',
									}}
								>
									{chatPartner.specialization}
								</Typography>
							)}
						</>
					) : (
						'Чат'
					)}
				</Typography>
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
					const isCurrentUser = msg.sender?.id === currentUser.id

					return (
						<Box
							key={msg.id}
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
							<Typography variant='body2' sx={{ wordBreak: 'break-word' }}>
								{msg.content}
							</Typography>
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

			{/* Ввод */}
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
					disabled={!newMessage.trim()}
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
