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
import PatientAppointmentScheduler from '../PatientAppointmentScheduler/PatientAppointmentScheduler'

import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import CakeIcon from '@mui/icons-material/Cake'
import WcIcon from '@mui/icons-material/Wc'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import DescriptionIcon from '@mui/icons-material/Description'
import InfoIcon from '@mui/icons-material/Info'
import HealingIcon from '@mui/icons-material/Healing'

// Функция для вычисления возраста с правильным склонением
const calculateAge = (birthDate: string): string => {
	if (!birthDate) return 'Не указано'

	const today = new Date()
	const birthDateObj = new Date(birthDate)

	if (isNaN(birthDateObj.getTime())) return 'Неверная дата'

	let age = today.getFullYear() - birthDateObj.getFullYear()
	const monthDiff = today.getMonth() - birthDateObj.getMonth()

	if (
		monthDiff < 0 ||
		(monthDiff === 0 && today.getDate() < birthDateObj.getDate())
	) {
		age--
	}

	// Склонение слова "год"
	const lastDigit = age % 10
	const lastTwoDigits = age % 100

	if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
		return `${age} лет`
	}

	switch (lastDigit) {
		case 1:
			return `${age} год`
		case 2:
		case 3:
		case 4:
			return `${age} года`
		default:
			return `${age} лет`
	}
}

interface InfoRowProps {
	label: string
	value: string | number | null | undefined
	icon: React.ReactNode
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, icon }) => {
	if (!value) return null

	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'flex-start',
				gap: 1.5,
				mb: 2,
				borderBottom: '1px solid #eee',
				pb: 1,
			}}
		>
			<Box
				sx={{
					mt: 0.5,
					color: 'primary.main',
					minWidth: 24,
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				{icon}
			</Box>
			<Box>
				<Typography variant='caption' color='text.secondary'>
					{label}
				</Typography>
				<Typography
					variant='body2'
					fontWeight={500}
					sx={{ lineHeight: 1.4, color: 'text.primary' }}
				>
					{label === 'Возраст' && typeof value === 'string'
						? calculateAge(value)
						: value}
				</Typography>
			</Box>
		</Box>
	)
}

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
						borderRadius: '20px',
						p: 2.5,
						display: 'flex',
						alignItems: 'center',
						mb: 2,
						boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
					}}
				>
					<Avatar
						src={avatar_url || undefined}
						alt={`${first_name} ${last_name}`}
						sx={{
							width: 84,
							height: 84,
							mr: 2.5,
							bgcolor: avatar_url ? 'transparent' : '#fff',
							color: avatar_url ? '#fff' : '#1976d2',
							fontSize: 34,
							boxShadow: avatar_url ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
						}}
					>
						{!avatar_url && (first_name?.[0]?.toUpperCase() || 'D')}
					</Avatar>

					<Box sx={{ minWidth: 0 }}>
						<Typography
							variant='h6'
							fontWeight={700}
							noWrap
							sx={{
								fontSize: '1.25rem',
								lineHeight: 1.3,
								textOverflow: 'ellipsis',
								overflow: 'hidden',
							}}
						>
							{`${first_name ?? ''} ${middle_name ?? ''} ${last_name ?? ''}`}
						</Typography>

						<Typography
							variant='body2'
							color='rgba(255,255,255,0.85)'
							sx={{ mt: 0.5 }}
							noWrap
						>
							{specialization ?? 'Специализация не указана'}
						</Typography>
					</Box>
				</Box>

				{/* Аккордеон с информацией */}
				<Accordion
					elevation={3}
					disableGutters
					sx={{
						mb: 2,
						borderRadius: 3,
						overflow: 'hidden',
						bgcolor: '#fff',
						boxShadow: '0 6px 16px rgba(0, 0, 0, 0.06)',
						'&:before': { display: 'none' },
					}}
				>
					<AccordionSummary
						expandIcon={
							<ExpandMoreIcon sx={{ color: '#fff', fontSize: '1.6rem' }} />
						}
						sx={{
							bgcolor: '#1876d2',
							px: 2,
							py: 1.8,
							'& .MuiAccordionSummary-content': {
								alignItems: 'center',
							},
						}}
					>
						<Typography
							fontWeight={600}
							fontSize='1rem'
							color='#fff'
							sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
						>
							🩺 Информация о враче
						</Typography>
					</AccordionSummary>

					<AccordionDetails sx={{ px: 2.5, py: 2 }}>
						<InfoRow icon={<EmailIcon />} label='Email' value={email} />
						<InfoRow icon={<PhoneIcon />} label='Телефон' value={phone} />
						<InfoRow
							icon={<CakeIcon />}
							label='Возраст'
							value={date_of_birth}
						/>
						<InfoRow icon={<WcIcon />} label='Пол' value={gender} />
						<InfoRow
							icon={<WorkspacePremiumIcon />}
							label='Опыт'
							value={experience ? `${experience} лет` : null}
						/>
						<InfoRow
							icon={<DescriptionIcon />}
							label='Описание'
							value={description_for_patient}
						/>
						<InfoRow icon={<InfoIcon />} label='Биография' value={bio} />
						<InfoRow
							icon={<HealingIcon />}
							label='Медицинская история'
							value={medical_history}
						/>
					</AccordionDetails>
				</Accordion>

				<Accordion
					defaultExpanded
					expanded={isAppointmentAccordionOpen}
					onChange={() =>
						setIsAppointmentAccordionOpen(!isAppointmentAccordionOpen)
					}
					elevation={3}
					disableGutters
					sx={{
						mb: 2,
						borderRadius: 3,
						overflow: 'hidden',
						bgcolor: '#fefefe',
						boxShadow: '0 6px 16px rgba(0, 0, 0, 0.06)',
						'&:before': { display: 'none' },
					}}
				>
					<AccordionSummary
						expandIcon={
							<ExpandMoreIcon
								sx={{ color: 'primary.main', fontSize: '1.6rem' }}
							/>
						}
						sx={{
							bgcolor: '#ffd446',
							px: 2,
							py: 1.8,
							'& .MuiAccordionSummary-content': {
								alignItems: 'center',
								gap: 1,
							},
						}}
					>
						<Typography
							fontWeight={600}
							fontSize='1rem'
							color='success.main'
							sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
						>
							📅 Записаться на приём
						</Typography>
					</AccordionSummary>

					<AccordionDetails sx={{ px: 2.5, py: 2 }}>
						<Box textAlign='center'>
							<PatientAppointmentScheduler />
						</Box>
					</AccordionDetails>
				</Accordion>
			</Paper>
		</Box>
	)
}

export default DoctorDetails
