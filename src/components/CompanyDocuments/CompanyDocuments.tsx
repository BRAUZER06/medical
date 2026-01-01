import React from 'react'
import { Box, Button, Paper, Typography } from '@mui/material'
import DescriptionIcon from '@mui/icons-material/Description'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

const CompanyDocuments = () => {
	const documents = [
		{
			title: 'Политика конфиденциальности',
			url: '/documents/privacy_policy.html',
		},
		{
			title: 'Декларация об ответственности за консультации',
			url: '/documents/declaration_of_responsibility.html',
		},
		{
			title: 'Политика обработки cookies и технических данных',
			url: '/documents/cookies_policy.html',
		},
		{
			title: 'Политика оператора в отношении обработки персональных данных',
			url: '/documents/personal_data_policy.html',
		},
		{
			title: 'Правила возврата денежных средств за оказанную информационную услугу',
			url: '/documents/refund_policy.html',
		},
		{
			title: 'Правила модерации и блокировки',
			url: '/documents/moderation_rules.html',
		},
		{
			title: 'Регламент оказания консультаций на интернет-платформе',
			url: '/documents/consultation_regulations.html',
		},
	]

	const handleOpenDocument = (url: string) => {
		window.open(url, '_blank')
	}

	return (
		<Paper
			elevation={1}
			sx={{
				p: 2,
				mb: 3,
				borderRadius: 2,
				backgroundColor: '#f9f9f9',
			}}
		>
			<Typography
				variant='h6'
				gutterBottom
				sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
			>
				<DescriptionIcon />
				О компании
			</Typography>
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
				{documents.map((doc, index) => (
					<Button
						key={index}
						variant='outlined'
						fullWidth
						startIcon={<DescriptionIcon />}
						endIcon={<OpenInNewIcon />}
						onClick={() => handleOpenDocument(doc.url)}
						sx={{
							justifyContent: 'space-between',
							textTransform: 'none',
							borderRadius: 2,
							py: 1.5,
							color: '#111827',
							borderColor: '#e5e7eb',
							'& .MuiSvgIcon-root': { color: '#4b5563' },
							'&:hover': {
								backgroundColor: 'rgba(17, 24, 39, 0.04)',
								borderColor: '#d1d5db',
							},
						}}
					>
						{doc.title}
					</Button>
				))}
			</Box>
		</Paper>
	)
}

export default CompanyDocuments
