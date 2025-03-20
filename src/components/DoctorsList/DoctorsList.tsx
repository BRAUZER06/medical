import React from 'react'
import { Box, CircularProgress, Typography, useTheme } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import DoctorCard from '../DoctorCard/DoctorCard'
import { getAllDoctors } from '../../api/doctors'
import { motion } from 'framer-motion'

const DoctorsList: React.FC = () => {
	const navigate = useNavigate()
	const theme = useTheme()

	const { data, isLoading, error } = useQuery({
		queryKey: ['doctors'],
		queryFn: getAllDoctors,
	})

	if (isLoading)
		return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 5 }} />
	if (error)
		return (
			<Typography color='error' textAlign='center' mt={4}>
				Ошибка загрузки докторов
			</Typography>
		)

	return (
		<Box sx={{ p: "5px", maxWidth: 800, mx: 'auto' }}>
			<Typography
				variant='h4'
				fontWeight='bold'
				mb={4}
				textAlign='center'
				color='text.primary'
			>
				Наши врачи
			</Typography>

			<Box
				component={motion.div}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
			>
				{data?.data.map((doctor, index) => (
					<Box
						key={doctor.id}
						onClick={() => navigate(`/doctors/${doctor.id}`)}
						sx={{ cursor: 'pointer', mb: 3 }}
						component={motion.div}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						transition={{ type: 'spring', stiffness: 300 }}
					>
						<DoctorCard doctor={doctor} />
					</Box>
				))}
			</Box>
		</Box>
	)
}

export default DoctorsList
