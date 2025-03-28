import React, { useState, useEffect } from 'react'
import {
	Box,
	Typography,
	CircularProgress,
	Button,
	TextField,
	Stack,
} from '@mui/material'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useParams } from 'react-router-dom'
import { fetchAvailableSlots, createAppointment } from '../../api/calendar'

dayjs.locale('ru')

type Slot = {
	id: number
	start: string
	end: string
}

const PatientAppointmentScheduler = () => {
	const { id } = useParams<{ id: string }>()
	const [selectedDate, setSelectedDate] = useState(dayjs())
	const [availableSlots, setAvailableSlots] = useState<Slot[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null)
	const [notes, setNotes] = useState('')

	useEffect(() => {
		fetchSlots()
	}, [id])

	const fetchSlots = async () => {
		if (!id) return
		setIsLoading(true)
		try {
			const slots = await fetchAvailableSlots(parseInt(id))
			setAvailableSlots(slots)
		} catch (error) {
			console.error('Ошибка при получении слотов:', error)
		} finally {
			setIsLoading(false)
		}
	}

	const slotsForSelectedDate = availableSlots.filter(slot =>
		dayjs(slot.start).isSame(selectedDate, 'day')
	)

	const filterSlotsByTime = (startHour: number, endHour: number) =>
		slotsForSelectedDate.filter(
			slot =>
				dayjs(slot.start).hour() >= startHour &&
				dayjs(slot.start).hour() < endHour
		)

	const renderSlots = (title: string, slots: Slot[]) => (
		<Box mt={3}>
			<Typography variant="h6" mb={1}>
				{title}
			</Typography>
			<Stack direction="row" spacing={1} flexWrap="wrap">
				{slots.map(slot => (
					<Button
						key={slot.id}
						variant={selectedSlotId === slot.id ? 'outlined' : 'contained'}
						onClick={() => setSelectedSlotId(slot.id)}
						sx={{ minWidth: '100px' }}
					>
						{dayjs(slot.start).format('HH:mm')} -{' '}
						{dayjs(slot.end).format('HH:mm')}
					</Button>
				))}
			</Stack>
		</Box>
	)

	const handleSubmit = async () => {
		if (!id || !selectedSlotId) {
			alert('Выберите слот для записи')
			return
		}

		const payload = {
			appointment: {
				doctor_id: parseInt(id),
				availability_id: selectedSlotId,
				notes,
			},
		}

		try {
			await createAppointment(payload)
			alert('Запись успешно создана')
			setSelectedSlotId(null)
			setNotes('')
			fetchSlots() // Обновляем слоты после записи
		} catch (error) {
			console.error('Ошибка при записи:', error)
			alert('Ошибка при создании записи')
		}
	}

	return (
		<Box p={2}>
			<Typography variant="h5">Запись к врачу</Typography>

			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<DateCalendar
					value={selectedDate}
					onChange={newDate => setSelectedDate(newDate!)}
				/>
			</LocalizationProvider>

			{isLoading ? (
				<CircularProgress />
			) : (
				<>
					{slotsForSelectedDate.length === 0 ? (
						<Typography mt={3}>
							Нет доступных слотов на выбранную дату
						</Typography>
					) : (
						<>
							{renderSlots('Утро', filterSlotsByTime(6, 12))}
							{renderSlots('День', filterSlotsByTime(12, 18))}
							{renderSlots('Вечер', filterSlotsByTime(18, 24))}
						</>
					)}
				</>
			)}

			<TextField
				label="Комментарий"
				multiline
				fullWidth
				rows={3}
				value={notes}
				onChange={e => setNotes(e.target.value)}
				sx={{ mt: 3 }}
			/>

			<Button
				variant="contained"
				color="primary"
				sx={{ mt: 3 }}
				onClick={handleSubmit}
			>
				Записаться
			</Button>
		</Box>
	)
}

export default PatientAppointmentScheduler
