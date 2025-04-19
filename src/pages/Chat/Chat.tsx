import React from 'react'
import {
	Box,
	Typography,
	IconButton,
	TextField,
	Button,
	Avatar,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'

const messages = [
	{
		id: 1,
		from: 'doctor',
		text: 'Здравствуйте! Чем могу помочь?',
	},
	{
		id: 2,
		from: 'user',
		text: 'Здравствуйте, у меня болит живот уже 2 дня...',
	},
	{
		id: 3,
		from: 'doctor',
		text: 'Понимаю. Были ли у вас симптомы температуры или тошнота?',
	},
	{
		id: 4,
		from: 'user',
		text: 'Температуры не было, но вчера была лёгкая тошнота.',
	},
	{
		id: 5,
		from: 'doctor',
		text: 'Спасибо. Что вы ели в последний день перед началом боли?',
	},
	{
		id: 6,
		from: 'user',
		text: 'Вроде всё обычное... курица, салат, хлеб. Запил соком.',
	},
	{
		id: 7,
		from: 'doctor',
		text: 'Хорошо. Боль локализована в одной части живота или размыта?',
	},
	{
		id: 8,
		from: 'user',
		text: 'Скорее слева, но иногда ощущается и в центре.',
	},
	{
		id: 9,
		from: 'doctor',
		text: 'Понятно. На всякий случай рекомендую сдать общий анализ крови и УЗИ.',
	},
	{
		id: 10,
		from: 'user',
		text: 'Спасибо большое! Постараюсь завтра записаться.',
	},
	{
		id: 11,
		from: 'doctor',
		text: 'Хорошо. Если состояние ухудшится — немедленно обратитесь очно.',
	},
	{
		id: 12,
		from: 'user',
		text: 'Поняла, спасибо! Хорошего дня.',
	},
	{
		id: 13,
		from: 'doctor',
		text: 'И вам здоровья. Берегите себя!',
	},
]


export default function Chat() {
	const navigate = useNavigate()

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
			{/* Верхняя панель */}
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					px: 2,
					py: 1,
					borderBottom: '1px solid #ccc',
					backgroundColor: '#f9f9f9',
				}}
			>
				<IconButton onClick={() => navigate(-1)}>
					<ArrowBackIcon />
				</IconButton>
				<Avatar
					src='https://avatars.mds.yandex.net/get-med/117703/20180206_telemed_taxonomy_icon_square_large_gastroenterologist_1.0/orig'
					sx={{ mx: 1 }}
				/>
				<Typography variant='h6' noWrap>
					Гастроэнтеролог Анна
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
				{messages.map(msg => (
					<Box
						key={msg.id}
						sx={{
							alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start',
							backgroundColor: msg.from === 'user' ? '#1976d2' : '#e0e0e0',
							color: msg.from === 'user' ? 'white' : 'black',
							px: 2,
							py: 1,
							borderRadius: 2,
							maxWidth: '80%',
						}}
					>
						{msg.text}
					</Box>
				))}
			</Box>

			{/* Поле ввода */}
			<Box
				sx={{
					p: 2,
					borderTop: '1px solid #ccc',
					backgroundColor: 'white',
					display: 'flex',
					gap: 1,
				}}
			>
				<TextField
					placeholder='Напишите сообщение...'
					fullWidth
					size='small'
					disabled
				/>
				<Button variant='contained' disabled>
					Отправить
				</Button>
			</Box>
		</Box>
	)
}
