import React, { useState } from 'react'
import { Box, Typography, Paper, Button } from '@mui/material'
import styles from './PatientHistory.module.scss'

interface Visit {
	doctorName: string
	specialty: string
	date: string
	notes: string
}

interface PatientHistoryProps {
	visits: Visit[]
}

const PatientHistory: React.FC<PatientHistoryProps> = ({ visits }) => {
	const [showAll, setShowAll] = useState(false)

	const handleToggleShowAll = () => {
		setShowAll(prevState => !prevState) 
	}

	const displayedVisits = showAll ? visits : visits.slice(0, 3) 

	return (
		<Paper className={styles.historyWrapper}>
			<Typography variant='h6' className={styles.historyTitle}>
				История посещений
			</Typography>
			{displayedVisits.length > 0 ? (
				displayedVisits.map((visit, index) => (
					<Box key={index} className={styles.visitCard}>
						<Box className={styles.visitHeader}>
							<Typography variant='h6' className={styles.doctorName}>
								{visit.doctorName}
							</Typography>
							<Typography variant='body2' className={styles.specialty}>
								{visit.specialty}
							</Typography>
						</Box>
						<Typography variant='body2' className={styles.visitDate}>
							{visit.date}
						</Typography>
						<Typography variant='body2' className={styles.visitNotes}>
							{visit.notes}
						</Typography>
					</Box>
				))
			) : (
				<Typography variant='body2' color='textSecondary'>
					Нет посещений
				</Typography>
			)}
			{/* Кнопка "Показать еще" или "Скрыть" в зависимости от состояния */}
			{visits.length > 3 && (
				<Button
					variant='outlined'
					color='info'
					onClick={handleToggleShowAll}
					fullWidth
				>
					{showAll ? 'Скрыть' : 'Показать еще'}
				</Button>
			)}
		</Paper>
	)
}

export default PatientHistory
