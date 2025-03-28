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
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
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
			whileHover={{ y: -3 }}
			whileTap={{ scale: 0.98 }}
			sx={{
				p: 1.5,
				borderRadius: 2,
				backgroundColor: '#5dd7e8',
				color: '#fff',
				transition: 'all 0.2s ease-in-out',
				boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
				cursor: 'pointer',
			}}
		>
			{/* Header: Аватар + Инфо + Кнопка */}
			<Box
				display="flex"
				alignItems="center"
				justifyContent="space-between"
				mb={1}
			>
				{/* Левая часть: Аватар и Имя */}
				<Box display="flex" alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
					<Avatar
						src={avatar_url || undefined}
						alt={fullName}
						sx={{
							width: 48,
							height: 48,
							mr: 1.5,
							bgcolor: avatar_url ? 'transparent' : theme.palette.primary.main,
							color: '#fff',
							fontSize: 18,
							border: avatar_url
								? 'none'
								: `2px solid ${theme.palette.primary.light}`,
							flexShrink: 0,
						}}
					>
						{!avatar_url && (
							<AccountCircleIcon fontSize="medium" sx={{ color: '#fff' }} />
						)}
					</Avatar>

					<Box sx={{ minWidth: 0 }}>
						<Typography
							variant="subtitle2"
							fontWeight={600}
							noWrap
							color="inherit"
							sx={{ maxWidth: '170px' }}
						>
							{fullName}
						</Typography>

						{specialization && (
							<Box display="flex" alignItems="center" gap={0.5}>
								<MedicalServicesIcon fontSize="small" sx={{ color: 'white' }} />
								<Typography
									variant="caption"
									color="rgba(255,255,255,0.8)"
									noWrap
								>
									{specialization}
								</Typography>
							</Box>
						)}
					</Box>
				</Box>

				{/* Кнопка справа */}
				<Tooltip title="Записаться">
					<IconButton
						size="small"
						sx={{
							color: '#fff',
							ml: 1,
							backgroundColor: 'rgba(255,255,255,0.2)',
							'&:hover': {
								backgroundColor: 'rgba(255,255,255,0.3)',
							},
							flexShrink: 0,
						}}
					>
						<CalendarMonthIcon fontSize="small" />
					</IconButton>
				</Tooltip>
			</Box>

			{/* Контент: Bio + Опыт */}
			<Box px={0.5}>
				{bio && (
					<Box display="flex" alignItems="flex-start" gap={0.5} mb={0.5}>
						<HistoryEduIcon fontSize="small" sx={{ mt: 0.3, color: '#fff' }} />
						<Typography
							variant="caption"
							color="rgba(255,255,255,0.9)"
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

				{experience && (
					<Box display="flex" alignItems="center" gap={0.5}>
						<WorkspacePremiumIcon fontSize="small" sx={{ color: '#fff' }} />
						<Typography variant="caption" color="rgba(255,255,255,0.9)" noWrap>
							Опыт: {experience}{' '}
							{experience === 1 ? 'год' : experience < 5 ? 'года' : 'лет'}
						</Typography>
					</Box>
				)}
			</Box>
		</Card>
	)
}

export default DoctorCard
