import { Box, Typography, IconButton, Avatar } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'

export const ChatHeader = ({ chatPartner }: { chatPartner: any }) => {
	const navigate = useNavigate()

	const handleNavigateToProfile = () => {
		if (!chatPartner) return
		if (chatPartner.role === 'patient') navigate(`/patients/${chatPartner.id}`)
		else if (chatPartner.role === 'doctor')
			navigate(`/doctors/${chatPartner.id}`)
	}

	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				px: 2,
				py: 1,
				borderBottom: '1px solid #ccc',
				backgroundColor: '#f9f9f9',
				flexShrink: 0,
			}}
		>
			<IconButton onClick={() => navigate(-1)}>
				<ArrowBackIcon />
			</IconButton>
			<Avatar sx={{ mx: 1 }} />
			<Box>
				<Typography
					variant='h6'
					noWrap
					sx={{ cursor: chatPartner ? 'pointer' : 'default' }}
					onClick={chatPartner ? handleNavigateToProfile : undefined}
				>
					{chatPartner
						? `${chatPartner.first_name} ${chatPartner.last_name}`
						: 'Чат'}
				</Typography>
				{chatPartner?.specialization && (
					<Typography variant='caption' sx={{ display: 'block' }}>
						{chatPartner.specialization}
					</Typography>
				)}
			</Box>
		</Box>
	)
}
