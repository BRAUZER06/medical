import React from 'react'
import { Button, Typography, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { motion } from 'framer-motion'
import styles from './NotFoundPage.module.scss'

const NotFoundPage: React.FC = () => {
	const navigate = useNavigate()

	return (
		<Box className={styles.pageWrapper}>
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className={styles.errorContent}
			>
				<ErrorOutlineIcon sx={{ fontSize: 80, color: '#1976d2', mb: 2 }} />

				<Typography variant='h2' className={styles.title}>
					404
				</Typography>

				<Typography variant='h6' className={styles.message}>
					Упс! Эта страница недоступна или ещё в разработке.
				</Typography>

				<Box
					mt={4}
					display='flex'
					gap={2}
					flexWrap='wrap'
					justifyContent='center'
				>
					<Button
						variant='contained'
						color='primary'
						onClick={() => navigate(-1)}
					>
						Назад
					</Button>
					<Button
						variant='contained'
						color='primary'
						onClick={() => navigate('/')}
					>
						На главную
					</Button>
				</Box>
			</motion.div>
		</Box>
	)
}

export default NotFoundPage
