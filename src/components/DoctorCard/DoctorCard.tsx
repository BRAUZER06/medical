import React from 'react'
import {
	Box,
	Typography,
	Avatar,
	Card,
	CardContent,
	Button,
	useTheme,
} from '@mui/material'
import { DoctorResponseItem } from '../../api/doctors'
import { motion } from 'framer-motion'

interface DoctorCardProps {
	doctor: DoctorResponseItem
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
	const theme = useTheme()
	const {
		first_name,
		last_name,
		middle_name,
		specialization,
		experience,
		description_for_patient,
		avatar_url,
	} = doctor.attributes

	return (
		<Card
			sx={{
				p: 1,
				borderRadius: '20px',
				boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
				backgroundColor: theme.palette.background.paper,
				transition: 'transform 0.2s, box-shadow 0.2s',
				'&:hover': {
					boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
				},
			}}
			component={motion.div}
			whileHover={{ y: -5 }}
		>
			<Box display='flex' alignItems='center'>
				<Avatar
					sx={{
						width: 80,
						height: 80,
						mr: 1,
						bgcolor: theme.palette.primary.main,
						color: '#fff',
						fontSize: 32,
						border: `2px solid ${theme.palette.primary.main}`,
					}}
					src={avatar_url || ''}
				>
					{first_name?.[0] || 'D'}
				</Avatar>

				<Box>
					<Typography variant='h6' fontWeight='bold' color='text.primary'>
						{`${first_name ?? ''} ${middle_name ?? ''} ${last_name ?? ''}`}
					</Typography>
					<Typography variant='subtitle1' color='text.secondary'>
						{specialization ?? 'Специализация не указана'}
					</Typography>
				</Box>
			</Box>

			<CardContent sx={{ pl: 0, pr: 0 }} style={{paddingBottom:"2px"}}>
				<Typography variant='body1' color='text.secondary' mb={2}>
					{description_for_patient ?? 'Описание врача отсутствует.'}
				</Typography>

				{experience && (
					<Typography variant='body2' color='text.secondary' mb={2}>
						Опыт: {experience}
					</Typography>
				)}

				<Button
					fullWidth
					variant='contained'
					sx={{
					
						borderRadius: '12px',
						backgroundColor: theme.palette.primary.main,
						color: '#fff',
						fontWeight: 'bold',
						py: 1.5,
						'&:hover': {
							backgroundColor: theme.palette.primary.dark,
						},
					}}
				>
					Записаться
				</Button>
			</CardContent>
		</Card>
	)
}

export default DoctorCard
