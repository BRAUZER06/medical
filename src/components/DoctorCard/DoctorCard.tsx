import {
	Box,
	Typography,
	Avatar,
	Card,
	useTheme,
	IconButton,
	Tooltip,
} from '@mui/material'
import { DoctorResponseItem } from '../../api/doctors'
import { motion } from 'framer-motion'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'
import HistoryEduIcon from '@mui/icons-material/HistoryEdu'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

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
		bio,
		avatar_url,
	} = doctor.attributes

	const fullName = [first_name, middle_name, last_name]
		.filter(Boolean)
		.join(' ')
	const initials = `${first_name?.[0] ?? ''}${last_name?.[0] ?? ''}`

	return (
		<Card
			component={motion.div}
		
			sx={{
				borderRadius: 2,
				backgroundColor: '#fff',
				color: 'inherit',
				transition: 'all 0.2s ease-in-out',
				boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
				cursor: 'pointer',
			}}
		>
			<Box display='flex' alignItems='stretch' gap={0}>
				{/* Левая колонка с аватаром и иконкой */}
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						background: specialization && bio ? '#01c9e5' : '#afc1c3',
						padding: 2,
					}}
				>
					<Avatar
						src={avatar_url || undefined}
						alt={fullName}
						sx={{
							width: 56,
							height: 56,
							bgcolor: avatar_url ? 'transparent' : theme.palette.grey[300],
							color: '#000',
							fontSize: 18,
							border: avatar_url
								? 'none'
								: `2px solid ${theme.palette.grey[400]}`,
						}}
					>
						{!avatar_url && (
							<AccountCircleIcon fontSize='medium' sx={{ color: '#666' }} />
						)}
					</Avatar>
					{(specialization && bio) && (
						<MedicalServicesIcon
							fontSize='small'
							sx={{ mt: 2, color: '#fff' }}
						/>
					)}
				</Box>

				{/* Правая часть с контентом */}
				<Box flex={1} minWidth={0} p={1} pr={2} pl={2}>
					{/* Верхняя строка: имя и кнопка */}
					<Box
						display='flex'
						justifyContent='space-between'
						alignItems='center'
						mb={0.5}
					>
						<Typography
							variant='subtitle2'
							fontWeight={600}
							noWrap
							sx={{ maxWidth: '170px', color: '#222' }}
						>
							{fullName}
						</Typography>
						<Tooltip title='Записаться'>
							<IconButton
								size='small'
								sx={{
									color: theme.palette.primary.main,
									backgroundColor: 'rgba(0,0,0,0.05)',
									'&:hover': {
										backgroundColor: 'rgba(0,0,0,0.1)',
									},
								}}
							>
								<CalendarMonthIcon fontSize='small' />
							</IconButton>
						</Tooltip>
					</Box>

					{/* Специализация */}
					{specialization && (
						<Box display='flex' alignItems='center' gap={0.5} mb={0.5}>
							<MedicalServicesIcon fontSize='small' sx={{ color: '#666' }} />
							<Typography variant='caption' color='text.secondary' noWrap>
								{specialization}
							</Typography>
						</Box>
					)}

					{/* Биография */}
					{bio && (
						<Box display='flex' alignItems='flex-start' gap={0.5} mb={0.5}>
							<HistoryEduIcon
								fontSize='small'
								sx={{ mt: 0.3, color: '#666' }}
							/>
							<Typography
								variant='caption'
								color='text.secondary'
								lineHeight={1.4}
								sx={{
									overflow: 'hidden',
									display: '-webkit-box',
									WebkitLineClamp: 2,
									WebkitBoxOrient: 'vertical',
								}}
							>
								{bio}
							</Typography>
						</Box>
					)}

					{/* Опыт */}
					{experience && (
						<Box display='flex' alignItems='center' gap={0.5}>
							<WorkspacePremiumIcon fontSize='small' sx={{ color: '#666' }} />
							<Typography variant='caption' color='text.secondary' noWrap>
								Опыт: {experience}{' '}
								{experience === 1 ? 'год' : experience < 5 ? 'года' : 'лет'}
							</Typography>
						</Box>
					)}
				</Box>
			</Box>
		</Card>
	)
}

export default DoctorCard
