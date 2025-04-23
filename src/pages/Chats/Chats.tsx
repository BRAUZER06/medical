import React from 'react'
import {
	Box,
	Typography,
	List,
	ListItem,
	ListItemAvatar,
	Avatar,
	ListItemText,
	Divider,
	IconButton,
	CircularProgress,
} from '@mui/material'
import { ChatBubbleOutline } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getAllChats } from '../../api/chats'

export default function Chats() {
	const navigate = useNavigate()

	const {
		data: chats = [],
		isLoading,
		isError,
	} = useQuery({
		queryKey: ['chats'],
		queryFn: getAllChats,
	})

	const specializationLabels: Record<string, string> = {
		cardiologist: 'Кардиолог',
		neurologist: 'Невролог',
		dermatologist: 'Дерматолог',
		gastroenterologist: 'Гастроэнтеролог',
		// добавь остальные специализации при необходимости
	}

	return (
		<Box
			sx={{
				position: 'relative',
				minHeight: '100vh',
				backgroundColor: '#f5f5f5',
				p: 2,
			}}
		>
			<Typography variant='h5' gutterBottom>
				Чаты с врачами
			</Typography>

			{isLoading ? (
				<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
					<CircularProgress />
				</Box>
			) : isError ? (
				<Typography color='error' sx={{ mt: 4 }}>
					Ошибка загрузки чатов
				</Typography>
			) : chats.length === 0 ? (
				<Box sx={{ textAlign: 'center', mt: 6 }}>
					<img
						src='https://cdn-icons-png.flaticon.com/512/4076/4076549.png'
						alt='Нет чатов'
						width={64}
						height={64}
						style={{ marginBottom: 16 }}
					/>
					<Typography variant='body1' color='text.secondary'>
						Чаты с врачами отсутствуют
					</Typography>
				</Box>
			) : (
				<List>
					{chats.map(chat => {
						const doctor = chat.user
						const name = `${doctor.first_name} ${doctor.last_name}`
						const specialization =
							specializationLabels[doctor.specialization] ||
							doctor.specialization

						return (
							<React.Fragment key={chat.id}>
								<ListItem disablePadding>
									<ListItem
										button
										onClick={() => navigate(`../chats/${chat.id}`)}
										sx={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'space-between',
											width: '100%',
											px: 1,
										}}
									>
										<Box sx={{ display: 'flex', alignItems: 'center' }}>
											<ListItemAvatar>
												<Avatar>{doctor.first_name?.charAt(0)}</Avatar>
											</ListItemAvatar>
											<ListItemText
												primary={name}
												secondary={specialization}
												sx={{ ml: 1 }}
											/>
										</Box>

										<ChatBubbleOutline color='action' />
									</ListItem>
								</ListItem>
								<Divider component='li' />
							</React.Fragment>
						)
					})}
				</List>
			)}
		</Box>
	)
}
