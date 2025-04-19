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
		<Box sx={{ '&:not(:first-of-type)': { mt: 3 } }}>
			<Typography variant='h6' sx={{ mb: 1 }}>
				{title}
			</Typography>
			<Box
				sx={{
					display: 'flex',
					flexWrap: 'wrap',
					gap: '8px', // Используем gap вместо spacing
					'& .MuiButton-root': {
						minWidth: '100px',
						margin: 0, // Убираем возможные margin
						padding: '6px 8px', // Опционально: можно настроить padding
					},
				}}
			>
				{slots.map(slot => (
					<Button
						key={slot.id}
						variant='contained'
						onClick={() => setSelectedSlotId(slot.id)}
						sx={{
							minWidth: '100px',
							backgroundColor:
								selectedSlotId === slot.id ? '#4caf50' : '#ffeb3b',
							color: selectedSlotId === slot.id ? '#fff' : '#000',
							'&:hover': {
								backgroundColor:
									selectedSlotId === slot.id ? '#388e3c' : '#fbc02d',
							},
							border: selectedSlotId === slot.id ? '2px solid #2e7d32' : 'none',
						}}
					>
						{dayjs(slot.start).format('HH:mm')} -{' '}
						{dayjs(slot.end).format('HH:mm')}
					</Button>
				))}
			</Box>
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

			setSelectedSlotId(null)
			setNotes('')
			fetchSlots() // Обновляем слоты после записи
		} catch (error) {
			console.error('Ошибка при записи:', error)
		}
	}

	return (
		<Box>
			<Typography variant='h5'>Запись к врачу</Typography>

			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<DateCalendar
					value={selectedDate}
					onChange={newDate => setSelectedDate(newDate!)}
					sx={{
						width: '100%',
						maxWidth: '900px',
						minHeight: '355px',
						boxShadow: '0px 12px 17px #0000000d',
						borderRadius: '16px',
						padding: '0px 8px',
						'& .MuiPickersCalendarHeader-root': {
							display: 'flex',
							padding: '0px',
							justifyContent: 'space-between',
						},
						'& .MuiPickersCalendarHeader-label': {
							fontSize: '14px',
							textTransform: 'capitalize',
						},
						'& .MuiPickersCalendarHeader-labelContainer': {
							border: '2px solid gray',
							borderRadius: '50px',
							padding: '0px 0px 0px 15px',
						},
						'& .MuiPickersArrowSwitcher-root': {
							fontSize: '1.5rem',
						},
						'& .MuiDayCalendar-weekDayLabel': {
							fontSize: '14px',
							textTransform: 'capitalize',
						},
						'& .MuiPickersDay-root': {
							fontSize: '14px',
						},
						'& .MuiDayCalendar-weekContainer': {
							justifyContent: 'space-between',
						},
						'& .MuiDayCalendar-header': {
							justifyContent: 'space-between',
						},
						'& .MuiDayCalendar-slideTransition': {
							minHeight: '260px',
						},
						'& .Mui-selected': {
							background: '#f5f5f5  !important',
							border: 'none',
						},
					}}
				/>
			</LocalizationProvider>

			{isLoading ? (
				<CircularProgress />
			) : (
				<>
					{slotsForSelectedDate.length === 0 ? (
						<Box mt={3} p={2} bgcolor='#f5f5f5' borderRadius={2}>
							<Typography variant='body1' fontWeight={500}>
								Нет доступных слотов на выбранную дату.
							</Typography>
							<Typography variant='body2' mt={1}>
								Хотите написать врачу в личные сообщения?
							</Typography>
							<Typography
								variant='caption'
								color='text.secondary'
								mt={1}
								display='block'
							>
								Обратите внимание: врач может быть занят и не ответит сразу.
							</Typography>
						</Box>
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
				label='Комментарий'
				multiline
				fullWidth
				rows={3}
				value={notes}
				onChange={e => setNotes(e.target.value)}
				sx={{ mt: 3 }}
			/>

			<Button
				variant='contained'
				color='primary'
				sx={{ mt: 3 }}
				onClick={handleSubmit}
			>
				Записаться
			</Button>
		</Box>
	)
}

export default PatientAppointmentScheduler
