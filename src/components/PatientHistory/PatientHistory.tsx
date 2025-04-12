import React, { useState } from 'react'
import { Box, Typography, Paper, Button, Divider } from '@mui/material'
import EventIcon from '@mui/icons-material/Event'
import NotesIcon from '@mui/icons-material/Notes'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'

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

	const handleToggleShowAll = () => setShowAll(prev => !prev)

	const displayedVisits = showAll ? visits : visits.slice(0, 3)

	return (
		<Paper
			elevation={1}
			sx={{
				p: 2,
				borderRadius: 2,
				backgroundColor: '#fefefe',
				mt: 2,
			}}
		>
			<Typography variant="h6" gutterBottom>
				🧾 История посещений:
			</Typography>

			{displayedVisits.length > 0 ? (
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					{displayedVisits.map((visit, index) => (
						<Box
							key={index}
							sx={{
								p: 2,
								borderRadius: 2,
								backgroundColor: '#f5f5f5',
								display: 'flex',
								flexDirection: 'column',
								gap: 1,
							}}
						>
							<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
								<Typography fontWeight={600}>{visit.doctorName}</Typography>
								<Typography variant="body2" color="text.secondary">
									{visit.specialty}
								</Typography>
							</Box>

							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<EventIcon fontSize="small" color="action" />
								<Typography variant="body2">{visit.date}</Typography>
							</Box>

							<Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
								<NotesIcon fontSize="small" color="action" />
								<Typography variant="body2">{visit.notes}</Typography>
							</Box>
						</Box>
					))}
				</Box>
			) : (
				<Typography variant="body2" color="text.secondary">
					Нет посещений
				</Typography>
			)}

			{visits.length > 3 && (
				<>
					<Divider sx={{ my: 2 }} />
					<Button
						variant="outlined"
						color="primary"
						fullWidth
						onClick={handleToggleShowAll}
					>
						{showAll ? 'Скрыть' : 'Показать ещё'}
					</Button>
				</>
			)}
		</Paper>
	)
}

export default PatientHistory
