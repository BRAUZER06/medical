import React, { useState } from 'react'
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
	Button,
	ClickAwayListener,
} from '@mui/material'
import { ArrowForwardIos, Close } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

const mockChats = [
	{
		id: 1,
		name: 'Гастроэнтеролог Анна',
		lastMessage: 'Пожалуйста, следуйте диете...',
		avatar:
			'https://avatars.mds.yandex.net/get-med/117703/20180206_telemed_taxonomy_icon_square_large_gastroenterologist_1.0/orig',
	},
	// остальные врачи без изменений...
	{
		id: 2,
		name: 'Кардиолог Иван',
		lastMessage: 'Измерьте давление утром и вечером.',
		avatar:
			'https://avatars.mds.yandex.net/get-med/118939/20180220_iVxQQyFy_telemed_square_large_urologist_1.0/orig',
	},
	{
		id: 3,
		name: 'Детский психолог Ольга',
		lastMessage: 'Давайте обсудим поведение ребёнка.',
		avatar:
			'https://storage.yandexcloud.net/health-contents/Taxonomy/%D0%93%D0%B5%D0%BD%D0%B5%D1%82%D0%B8%D0%BA/1920x1920%20square_large.png',
	},
	{
		id: 4,
		name: 'Офтальмолог Алексей',
		lastMessage: 'Не забывайте про капли утром.',
		avatar:
			'https://avatars.mds.yandex.net/get-med/118939/20180417_telemed_square_large_gynecologist/orig',
	},
	{
		id: 5,
		name: 'Гинеколог Елена',
		lastMessage: 'Следующая консультация через неделю.',
		avatar:
			'https://avatars.mds.yandex.net/get-med/118939/20180220_iVxQQyFy_telemed_square_large_urologist_1.0/orig',
	},
	{
		id: 6,
		name: 'Иммунолог Сергей',
		lastMessage: 'Сдайте общий анализ крови.',
		avatar:
			'https://avatars.mds.yandex.net/get-med/144970/20180314_PYdyFsGb_telemed_square_large_allergologist_1.0/orig',
	},
	{
		id: 7,
		name: 'Педиатр Наталья',
		lastMessage: 'Температуру измеряйте 3 раза в день.',
		avatar:
			'https://avatars.mds.yandex.net/get-med/118939/20180417_telemed_square_large_gynecologist/orig',
	},
	{
		id: 8,
		name: 'Невролог Дмитрий',
		lastMessage: 'МРТ желательно сделать на следующей неделе.',
		avatar:
			'https://avatars.mds.yandex.net/get-med/117703/20171122_telemed_square_large_dermatologist_4.0/orig',
	},
	{
		id: 9,
		name: 'Дерматолог Инна',
		lastMessage: 'Мазь наносить 2 раза в день.',
		avatar:
			'https://avatars.mds.yandex.net/get-med/117703/20171122_telemed_square_large_dermatologist_4.0/orig',
	},
	{
		id: 10,
		name: 'Аллерголог Михаил',
		lastMessage: 'Пройдите тест на пищевые аллергены.',
		avatar:
			'https://avatars.mds.yandex.net/get-med/144970/20180314_PYdyFsGb_telemed_square_large_allergologist_1.0/orig',
	},
]

export default function Chats() {
	const navigate = useNavigate()
	const [showModal, setShowModal] = useState(true)

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

			<List>
				{mockChats.map(chat => (
					<React.Fragment key={chat.id}>
						<ListItem
							secondaryAction={
								<IconButton
									edge='end'
									onClick={() => navigate(`../${chat.id}`)}
								>
									<ArrowForwardIos fontSize='small' />
								</IconButton>
							}
							disablePadding
						>
							<ListItem button onClick={() => navigate(`../chats/${chat.id}`)}>
								<ListItemAvatar>
									<Avatar src={chat.avatar} alt={chat.name} />
								</ListItemAvatar>
								<ListItemText
									primary={chat.name}
									secondary={chat.lastMessage}
								/>
							</ListItem>
						</ListItem>
						<Divider component='li' />
					</React.Fragment>
				))}
			</List>

			{/* Модалка */}
			{showModal && (
				<Box
					sx={{
						position: 'fixed',
						top: 0,
						left: 0,
						width: '100vw',
						height: '100vh',
						zIndex: 1000,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						backgroundColor: 'rgba(0, 0, 0, 0.15)',
					}}
				>
					<ClickAwayListener onClickAway={() => setShowModal(false)}>
						<Box
							sx={{
								bgcolor: 'background.paper',
								boxShadow: 4,
								p: 3,
								borderRadius: 3,
								textAlign: 'center',
								maxWidth: 320,
								width: '90%',
								position: 'relative',
							}}
						>
							<IconButton
								size='small'
								sx={{ position: 'absolute', top: 8, right: 8 }}
								onClick={() => setShowModal(false)}
							>
								<Close />
							</IconButton>

							<Box sx={{ mb: 1 }}>
								<img
									src='https://cdn-icons-png.flaticon.com/512/5957/5957231.png'
									alt='in progress'
									width={48}
									height={48}
									style={{ margin: '0 auto' }}
								/>
							</Box>
							<Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1 }}>
								Страница в разработке
							</Typography>
							<Typography
								variant='body2'
								sx={{ color: 'text.secondary', mb: 2 }}
							>
								Раздел пока недоступен. Мы готовим полноценный чат с врачами.
							</Typography>
							<Button
								variant='contained'
								size='medium'
								onClick={() => navigate(-1)}
							>
								Назад
							</Button>
						</Box>
					</ClickAwayListener>
				</Box>
			)}
		</Box>
	)
}