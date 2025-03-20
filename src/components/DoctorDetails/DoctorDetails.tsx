import React, { useState } from 'react'
import {
	Box,
	Avatar,
	CircularProgress,
	Divider,
	Paper,
	List,
	ListItem,
	ListItemText,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Typography,
	Button,
} from '@mui/material'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getDoctorById } from '../../api/doctors'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const DoctorDetails: React.FC = () => {
	const { id } = useParams<{ id: string }>()
	const [isAppointmentAccordionOpen, setIsAppointmentAccordionOpen] =
		useState(true)

	const { data, isLoading, error } = useQuery({
		queryKey: ['doctor', id],
		queryFn: () => getDoctorById(id!),
		enabled: !!id,
	})

	if (isLoading)
		return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 5 }} />
	if (error || !data)
		return (
			<Box textAlign='center' mt={4} color='error.main'>
				Ошибка загрузки данных врача
			</Box>
		)

	const doctor = data.data
	const {
		first_name,
		last_name,
		middle_name,
		email,
		phone,
		date_of_birth,
		gender,
		specialization,
		bio,
		experience,
		description_for_patient,
		medical_history,
		avatar_url,
	} = doctor.attributes

	return (
		<Box sx={{ p: '4px', maxWidth: 600, mx: 'auto' }}>
			<Paper
				elevation={4}
				sx={{ borderRadius: '5px', p: 1, backgroundColor: '#f9f9f9' }}
			>
				{/* Аватар и имя */}
				<Box
					sx={{
						backgroundColor: '#1976d2',
						color: '#fff',
						borderRadius: '16px',
						p: 3,
						display: 'flex',
						alignItems: 'center',
						mb: '8px',
						boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
					}}
				>
					<Avatar
						sx={{
							width: 90,
							height: 90,
							mr: 3,
							bgcolor: '#fff',
							color: '#1976d2',
							fontSize: 36,
							border: '2px solid #fff',
						}}
						src={avatar_url || ''}
					>
						{first_name?.[0]?.toUpperCase() || 'D'}
					</Avatar>

					<Box>
						<Box fontSize='1.3rem' fontWeight='bold'>
							{`${first_name ?? ''} ${middle_name ?? ''} ${last_name ?? ''}`}
						</Box>
						<Box mt={1} fontSize='0.95rem' color='rgba(255,255,255,0.85)'>
							{specialization ?? 'Специализация не указана'}
						</Box>
					</Box>
				</Box>

				{/* Аккордеон с информацией */}
				<Accordion
					sx={{
						marginBottom: '10px',
						border: 'none',
						borderRadius: '12px',
						'&:before': { display: 'none' },
						
					}}
				>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Typography fontWeight='bold'>Информация о враче</Typography>
					</AccordionSummary>
					<AccordionDetails sx={{ p: 1 }}>
						<List dense>
							<InfoRow label='Email' value={email} />
							<InfoRow label='Телефон' value={phone} />
							<InfoRow label='Дата рождения' value={date_of_birth} />
							<InfoRow label='Пол' value={gender} />
							<InfoRow label='Опыт' value={experience} />
							<InfoRow label='Описание' value={description_for_patient} />
							<InfoRow label='Биография' value={bio} />
							<InfoRow label='Медицинская история' value={medical_history} />
						</List>
					</AccordionDetails>
				</Accordion>

				{/* Аккордеон для записи */}
				<Accordion
					defaultExpanded
					expanded={isAppointmentAccordionOpen}
					onChange={() =>
						setIsAppointmentAccordionOpen(!isAppointmentAccordionOpen)
					}
					sx={{
						marginBottom: '10px',
						border: 'none',

						borderRadius: '12px',
						'&:before': { display: 'none' },
					}}
				>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Typography fontWeight='bold'>Записаться на прием</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Box textAlign='center' p={2}>
							<Typography variant='body1' mb={3}>
								Здесь будет календарь для записи на прием.
							</Typography>
							<Button
								variant='contained'
								color='primary'
								onClick={() => setIsAppointmentAccordionOpen(true)}
							>
								Открыть календарь
							</Button>
						</Box>
					</AccordionDetails>
				</Accordion>
			</Paper>
		</Box>
	)
}

// Компонент для отображения строки информации
const InfoRow = ({ label, value }: { label: string; value: string | null }) => (
	<ListItem
		sx={{
			mb: 1,
			backgroundColor: '#fff',
			borderRadius: '12px',
			boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
			px: 1.5,
			py: "5px",
		}}
	>
		<ListItemText
			primary={label}
			primaryTypographyProps={{
				fontWeight: 'bold',
				fontSize: '0.9rem',
				color: '#555',
			}}
			secondary={value ?? 'Не указано'}
			secondaryTypographyProps={{ fontSize: '1rem', color: '#333' }}
		/>
	</ListItem>
)

export default DoctorDetails
