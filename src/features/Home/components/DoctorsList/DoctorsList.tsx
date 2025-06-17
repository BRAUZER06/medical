import React from 'react'
import { Button, Box, Typography } from '@mui/material'
import { ArrowForwardIos } from '@mui/icons-material' 
import styles from './DoctorsList.module.scss' 
import BigTitle from '../../../../components/BigTitle/BigTitle'
import { useNavigate } from 'react-router-dom'


interface Doctor {
	id: number
	name: string
	specialty: string
	description: string
	icon: string 
}

const doctors: Doctor[] = [
	{
		id: 1,
		name: 'Дежурный дерматовенеролог',
		specialty: 'В порядке очереди',
		description: 'Лечение заболеваний кожи',
		icon: 'https://avatars.mds.yandex.net/get-med/117703/20171122_telemed_square_large_dermatologist_4.0/orig',
	},
	{
		id: 2,
		name: 'Дежурный гинеколог',
		specialty: 'В порядке очереди',
		description: 'Консультации по женскому здоровью',
		icon: 'https://avatars.mds.yandex.net/get-med/118939/20180220_iVxQQyFy_telemed_square_large_urologist_1.0/orig',
	},
	{
		id: 3,
		name: 'Персональный медицинский консультант',
		specialty: 'Индивидуальный подбор врача',
		description: 'Запись на личный прием',
		icon: 'https://avatars.mds.yandex.net/get-med/117703/20180206_telemed_taxonomy_icon_square_large_gastroenterologist_1.0/orig',
	},
	{
		id: 4,
		name: 'Аллерголог-иммунолог',
		specialty: 'Нарушения иммунной системы',
		description: 'Консультации по аллергиям',
		icon: 'https://avatars.mds.yandex.net/get-med/144970/20180314_PYdyFsGb_telemed_square_large_allergologist_1.0/orig',
	},
	{
		id: 5,
		name: 'Гастроэнтеролог',
		specialty: 'Проблемы пищеварения',
		description: 'Диагностика и лечение заболеваний ЖКТ',
		icon: 'https://avatars.mds.yandex.net/get-med/118939/20180417_telemed_square_large_gynecologist/orig',
	},
	{
		id: 6,
		name: 'Детский психолог',
		specialty: 'Помощь детям и родителям',
		description: 'Психологическая помощь детям',
		icon: 'https://storage.yandexcloud.net/health-contents/Taxonomy/%D0%93%D0%B5%D0%BD%D0%B5%D1%82%D0%B8%D0%BA/1920x1920%20square_large.png',
	},
	{
		id: 7,
		name: 'Кардиолог',
		specialty: 'Болезни сердца и сосудов',
		description: 'Диагностика и лечение сердечно-сосудистых заболеваний',
		icon: 'https://avatars.mds.yandex.net/get-med/118939/20180220_iVxQQyFy_telemed_square_large_urologist_1.0/orig',
	},
	{
		id: 8,
		name: 'Офтальмолог',
		specialty: 'Болезни глаз',
		description: 'Диагностика и лечение заболеваний глаз',
		icon: 'https://avatars.mds.yandex.net/get-med/118939/20180417_telemed_square_large_gynecologist/orig',
	},
]

const DoctorsList: React.FC = () => {
	const navigate = useNavigate()

	return (
		<Box className={styles.doctorsList}>
			<BigTitle title='Перечень врачей' />
			<div className={styles.topicList}>
				{doctors.map(doctor => (
					<Box key={doctor.id} className={styles.doctorCard}>
						<img
							src={doctor.icon}
							alt={doctor.name}
							className={styles.doctorIcon}
						/>
						<div className={styles.doctorInfo}>
							<Typography variant='h6' className={styles.doctorName}>
								{doctor.name}
							</Typography>
							<Typography variant='body2' className={styles.specialty}>
								{doctor.specialty}
							</Typography>
							<Typography variant='body2' className={styles.description}>
								{doctor.description}
							</Typography>
						</div>
						<ArrowForwardIos
							className={styles.arrowIcon}
							onClick={() => navigate('/')} // ✅ замена
						/>
					</Box>
				))}
			</div>

			<Button
				variant='contained'
				color='success'
				className={styles.showMoreButton}
				onClick={() => navigate('/')} // ✅ замена
			>
				Показать еще
			</Button>
		</Box>
	)
}

export default DoctorsList
