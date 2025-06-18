import React, { useEffect, useRef, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { createConsumer } from '@rails/actioncable'

import { getChatMessage, createMessage, getAllChats } from '../../api/chats'
import { fetchCurrentUser, User } from '../../api/profile'

import { ChatHeader } from './ChatHeader'
import { ChatMessages } from './ChatMessages'
import { FilePreviewList } from './FilePreviewList'
import { ChatInput } from './ChatInput'

const cable = createConsumer(import.meta.env.VITE_WS_URL || 'wss://only-doc.ru/cable')

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
	const { id: chatIdParam } = useParams()
	const chatId = Number(chatIdParam)
	const scrollRef = useRef<HTMLDivElement>(null)

	const [messages, setMessages] = useState<any[]>([])
	const [newMessage, setNewMessage] = useState('')
	const [attachedFiles, setAttachedFiles] = useState<File[]>([])
	const [selectedMessageType, setSelectedMessageType] = useState<
		'text' | 'image' | 'file'
	>('text')

	const subscriptionRef = useRef<any>(null)

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

		getChatMessage(chatId).then(data => setMessages(data))

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

		attachedFiles.forEach(file => formData.append('attachments[]', file))

		if (newMessage.trim()) formData.append('content', newMessage)

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
			<ChatHeader chatPartner={chatPartner} />
			<ChatMessages
				messages={messages}
				currentUser={currentUser}
				scrollRef={scrollRef}
			/>
			{attachedFiles.length > 0 && (
				<FilePreviewList files={attachedFiles} onRemove={handleRemoveFile} />
			)}
			<ChatInput
				newMessage={newMessage}
				setNewMessage={setNewMessage}
				handleSend={handleSend}
				handleFileChange={handleFileChange}
				attachedFiles={attachedFiles} 
			/>
		</Box>
	)
}
