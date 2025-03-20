import React, { useState, useEffect } from 'react'
import { Box, Typography, CircularProgress } from '@mui/material'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useParams } from 'react-router-dom'
import { fetchAvailableSlots, AvailabilitySlot } from '../../api/calendar'
import { TimeSlotAccordion } from '../WorkSchedulePicker/ui/TimeSlotAccordion'

dayjs.locale('ru')

const PatientAppointmentScheduler = () => {
	const { id } = useParams<{ id: string }>() // Получаем id доктора из URL
	const [selectedDate, setSelectedDate] = useState(dayjs()) // Выбранная дата
	const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]) // Доступные слоты
	const [isLoading, setIsLoading] = useState(false) // Состояние загрузки
	const [selectedTimes, setSelectedTimes] = useState({}) // Выбранные временные слоты

	// Получение доступных слотов при изменении даты
	useEffect(() => {
		const fetchSlots = async () => {
			if (!id) return // Если id отсутствует, выходим

			setIsLoading(true)
			try {
				const slots = await fetchAvailableSlots(
					parseInt(id), // Преобразуем id в число
					selectedDate.format('YYYY-MM-DD')
				)
				setAvailableSlots(slots)
			} catch (error) {
				console.error('Ошибка при получении слотов:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchSlots()
	}, [selectedDate, id]) // Зависимости: selectedDate и id

	// Обработчик выбора времени
	const handleTimeClick = time => {
		const dateKey = selectedDate.format('YYYY-MM-DD')
		const updatedSelectedTimes = { ...selectedTimes }

		// Если для текущей даты нет выбранных времен, создаем пустой массив
		if (!updatedSelectedTimes[dateKey]) {
			updatedSelectedTimes[dateKey] = []
		}

		// Если время уже выбрано, снимаем выбор
		if (updatedSelectedTimes[dateKey].includes(time)) {
			updatedSelectedTimes[dateKey] = updatedSelectedTimes[dateKey].filter(
				t => t !== time
			)
		} else {
			// Иначе выбираем новое время, удаляя предыдущее
			updatedSelectedTimes[dateKey] = [time] // Оставляем только одно время
		}

		setSelectedTimes(updatedSelectedTimes)
	}

	// Группировка слотов по времени суток
	const morningSlots = availableSlots
		.filter(slot => {
			const hour = dayjs(slot.start_time).hour()
			return hour >= 6 && hour < 12
		})
		.map(slot => dayjs(slot.start_time).format('HH:mm'))

	const daySlots = availableSlots
		.filter(slot => {
			const hour = dayjs(slot.start_time).hour()
			return hour >= 12 && hour < 18
		})
		.map(slot => dayjs(slot.start_time).format('HH:mm'))

	const eveningSlots = availableSlots
		.filter(slot => {
			const hour = dayjs(slot.start_time).hour()
			return hour >= 18 && hour < 24
		})
		.map(slot => dayjs(slot.start_time).format('HH:mm'))

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ru'>
			<Box sx={{ padding: 2, maxWidth: 600, margin: 'auto' }}>
				{/* Календарь */}
				<DateCalendar
					value={selectedDate}
					onChange={date => setSelectedDate(date)}
					sx={{
						width: '100%',
						maxWidth: '900px',
						minHeight: '355px',
						boxShadow: '0px 12px 17px #0000000d',
						borderRadius: '16px',
						padding: '0px 5px',
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

				{/* Доступные слоты */}
				<Box sx={{ marginTop: 4 }}>
					{!!availableSlots.length ? (
						<>
							{' '}
							<Typography variant='h6' gutterBottom>
								Доступные слоты на {selectedDate.format('DD.MM.YYYY')}
							</Typography>
							{isLoading ? (
								<CircularProgress />
							) : (
								<>
									{!!morningSlots.length && (
										<TimeSlotAccordion
											title='Утро'
											times={morningSlots}
											selectedTimes={
												selectedTimes[selectedDate.format('YYYY-MM-DD')] || []
											}
											handleTimeClick={handleTimeClick}
										/>
									)}
									{!!daySlots.length && (
										<TimeSlotAccordion
											title='День'
											times={daySlots}
											selectedTimes={
												selectedTimes[selectedDate.format('YYYY-MM-DD')] || []
											}
											handleTimeClick={handleTimeClick}
										/>
									)}
									{!!eveningSlots.length && (
										<TimeSlotAccordion
											title='Вечер'
											times={eveningSlots}
											selectedTimes={
												selectedTimes[selectedDate.format('YYYY-MM-DD')] || []
											}
											handleTimeClick={handleTimeClick}
										/>
									)}
								</>
							)}
						</>
					) : (
						<Typography variant='h6' gutterBottom>
							Доступных слотов нет
						</Typography>
					)}
				</Box>
			</Box>
		</LocalizationProvider>
	)
}

export default PatientAppointmentScheduler
