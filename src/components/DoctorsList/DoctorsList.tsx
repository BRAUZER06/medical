import {
	Box,
	Typography,
	CircularProgress,
	useTheme,
	Paper,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getAllDoctors } from '../../api/doctors'
import DoctorCard from '../DoctorCard/DoctorCard'
import { motion } from 'framer-motion'

const DoctorsList: React.FC = () => {
	const navigate = useNavigate()
	const theme = useTheme()

	const { data, isLoading, error } = useQuery({
		queryKey: ['doctors'],
		queryFn: getAllDoctors,
	})
	
	

	if (isLoading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
				<CircularProgress />
			</Box>
		)
	}

	if (error) {
		return (
			<Typography color="error" textAlign="center" mt={4}>
				Ошибка загрузки докторов
			</Typography>
		)
	}

	return (
		<Box sx={{ p:1, pt:2, pb:2, maxWidth: 800, mx: 'auto' }}>
			{/* Список врачей */}
			<Box
				component={motion.div}
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				display="flex"
				flexDirection="column"
				gap={1}
			>
				{data?.data.map(doctor => (
					<Box
						key={doctor.id}
						onClick={() => navigate(`/doctors/${doctor.id}`)}
						component={motion.div}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						transition={{ type: 'spring', stiffness: 250 }}
						sx={{
							cursor: 'pointer',
							borderRadius: 2,
							boxShadow: '0 3px 3px rgba(0, 0, 0, 0.1)', // ✅ тень
							transition: 'box-shadow 0.3s ease-in-out',
							'&:hover': {
								boxShadow: 'none', // немного глубже при наведении
							},
						}}
					>
						<DoctorCard doctor={doctor} />
					</Box>
				))}
			</Box>
		</Box>
	)
}

export default DoctorsList
