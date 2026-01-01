import React from 'react'
import { Box, Paper, Typography, Divider } from '@mui/material'
import CompanyDocuments from '../../components/CompanyDocuments/CompanyDocuments'

const Company = () => {
	return (
		<Box
			sx={{
				maxWidth: 640,
				mx: 'auto',
				py: 4,
				px: 2,
				minHeight: '100vh',
				background: 'linear-gradient(135deg, #f8f8f8 0%, #e8ecf3 100%)',
			}}
		>
			<Paper
				elevation={3}
				sx={{
					p: 3,
					mb: 3,
					borderRadius: 3,
					backgroundColor: '#ffffff',
					boxShadow: '0px 10px 25px rgba(0,0,0,0.06)',
				}}
			>
				<Typography variant='h5' fontWeight={700} gutterBottom>
					О компании
				</Typography>
				<Typography variant='body1' color='text.secondary' paragraph>
					Здесь собраны основные сведения о платформе, правила оказания услуг и
					нормативные документы. Информация доступна без авторизации, чтобы вы
					могли заранее ознакомиться с условиями работы сервиса.
				</Typography>

				<Divider sx={{ my: 2 }} />

				<Typography variant='h6' gutterBottom>
					Документы и реквизиты
				</Typography>
				<CompanyDocuments />
			</Paper>

			<Paper
				elevation={1}
				sx={{
					p: 3,
					borderRadius: 3,
					backgroundColor: '#ffffff',
					boxShadow: '0px 6px 18px rgba(0,0,0,0.04)',
				}}
			>
			</Paper>
		</Box>
	)
}

export default Company
