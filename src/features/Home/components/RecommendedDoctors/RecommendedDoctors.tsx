import React from 'react'
import {
	Box,
	Typography,
	Card,
	CardContent,
	Avatar,
	Button,
} from '@mui/material'

const recommended = [
	{
		id: 101,
		name: 'Невролог Ирина Петрова',
		description: 'Консультации при головных болях и стрессах',
		avatar:
			'https://avatars.mds.yandex.net/get-med/118939/20180417_telemed_square_large_gynecologist/orig',
	},
	{
		id: 102,
		name: 'Уролог Андрей Смирнов',
		description: 'Вопросы мочеполовой системы и профилактика',
		avatar:
			'https://avatars.mds.yandex.net/get-med/118939/20180220_iVxQQyFy_telemed_square_large_urologist_1.0/orig',
	},
	{
		id: 103,
		name: 'Терапевт Мария Котова',
		description: 'Общие консультации по ОРВИ, температуре, кашлю',
		avatar:
			'https://avatars.mds.yandex.net/get-med/117703/20171122_telemed_square_large_dermatologist_4.0/orig',
	},
	{
		id: 104,
		name: 'Кардиолог Артём Лебедев',
		description: 'Диагностика и лечение сердечно-сосудистых заболеваний',
		avatar:
			'https://avatars.mds.yandex.net/get-med/144970/20180314_PYdyFsGb_telemed_square_large_allergologist_1.0/orig',
	},
	{
		id: 105,
		name: 'Гастроэнтеролог Наталья Мороз',
		description: 'ЖКТ, пищеварение, хронические гастриты',
		avatar:
			'https://avatars.mds.yandex.net/get-med/117703/20180206_telemed_taxonomy_icon_square_large_gastroenterologist_1.0/orig',
	},

]

export default function RecommendedDoctors() {
	return (
		<Box sx={{ mt: 4, px: 2 }}>
			<Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
				Рекомендуемые Специалисты
			</Typography>
			{recommended.map(doctor => (
				<Card
					key={doctor.id}
					sx={{
						display: 'flex',
						alignItems: 'center',
						mb: 2,
						p: 2,
						boxShadow: 2,
						borderRadius: 2,
					}}
				>
					<Avatar
						src={doctor.avatar}
						alt={doctor.name}
						sx={{ width: 56, height: 56, mr: 2 }}
					/>
					<CardContent sx={{ flexGrow: 1, padding: '8px 0' }}>
						<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
							{doctor.name}
						</Typography>
						<Typography variant='body2' color='text.secondary'>
							{doctor.description}
						</Typography>
					</CardContent>
					<Button
						variant='contained'
						color='success'
					
						size='small'
						disabled
					>
						Профиль
					</Button>
				</Card>
			))}
		</Box>
	)
}
