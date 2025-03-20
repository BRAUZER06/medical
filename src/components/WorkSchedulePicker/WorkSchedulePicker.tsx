import React, { useState, useEffect } from 'react'
import { Box, Button, FormControlLabel, Switch } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton'
import { TimeSlotAccordion } from './ui/TimeSlotAccordion'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { getMyAvailabilities, setAvailabilities } from '../../api/calendar'

// Подключаем плагины dayjs
dayjs.extend(utc)
dayjs.extend(timezone)

// Функция для генерации временных слотов
const generateTimeSlots = (startTime, endTime, step) => {
	const slots = []
	const start = dayjs()
		.startOf('day')
		.hour(Number(startTime.split(':')[0]))
		.minute(Number(startTime.split(':')[1]))
	const end = dayjs()
		.startOf('day')
		.hour(Number(endTime.split(':')[0]))
		.minute(Number(endTime.split(':')[1]))

	const totalMinutes = end.diff(start, 'minute')
	const iterations = Math.floor(totalMinutes / step)

	for (let i = 0; i < iterations; i++) {
		const slotStart = start.clone().add(i * step, 'minute')
		const slotEnd = slotStart.clone().add(step, 'minute')

		slots.push({
			start: slotStart.format('HH:mm'),
			end: slotEnd.format('HH:mm'),
		})
	}

	// Проверка на остаток времени (чтобы захватить последний слот если он прям встык)
	const lastSlotStart = start.clone().add(iterations * step, 'minute')
	if (lastSlotStart.isBefore(end)) {
		slots.push({
			start: lastSlotStart.format('HH:mm'),
			end: end.format('HH:mm'),
		})
	}

	return slots
}

const morningTimes = generateTimeSlots('06:00', '11:59', 30)
const dayTimes = generateTimeSlots('12:00', '17:59', 30)
const eveningTimes = generateTimeSlots('18:00', '23:59', 30)

const CustomCalendar = () => {
	const [selectedTimes, setSelectedTimes] = useState([])
	const [selectedDate, setSelectedDate] = useState(dayjs())
	const [availableSlots, setAvailableSlots] = useState([])
	const [isLoading, setIsLoading] = useState(false)

console.log('selectedTimes', selectedTimes)



	// Загрузка доступных слотов при монтировании компонента
	useEffect(() => {
		const fetchSlots = async () => {
			setIsLoading(true)
			try {
				const response = await getMyAvailabilities()

				console.log('response', response)

				// Фильтруем слоты по выбранной дате
				const slotsForSelectedDate = response?.filter(slot =>
					dayjs(slot.start).isSame(selectedDate, 'day')
				)

				setAvailableSlots(slotsForSelectedDate)
				setSelectedTimes(slotsForSelectedDate) // Заполняем выбранные слоты
			} catch (error) {
				console.error('Ошибка при загрузке доступных слотов:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchSlots()
	}, [selectedDate])

	const handleDateChange = date => {
		setSelectedDate(date)
		setSelectedTimes([])
	}

	const handleTimeClick = timeSlot => {
		const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
		const dateKey = selectedDate.format('YYYY-MM-DD')

		// Преобразуем локальное время в международный формат (UTC)
		const internationalSlot = {
			start: dayjs
				.tz(`${dateKey}T${timeSlot.start}:00`, userTimeZone)
				.utc()
				.format(),
			end: dayjs
				.tz(`${dateKey}T${timeSlot.end}:00`, userTimeZone)
				.utc()
				.format(),
			booked: timeSlot.booked || false,
		}

		// Проверяем, есть ли уже такой слот в выбранных
		const isSlotSelected = selectedTimes.some(
			slot =>
				slot.start === internationalSlot.start &&
				slot.end === internationalSlot.end
		)

		if (isSlotSelected) {
			setSelectedTimes(prev =>
				prev.filter(
					slot =>
						!(
							slot.start === internationalSlot.start &&
							slot.end === internationalSlot.end &&
							!slot.booked
						)
				)
			)
		} else {
			setSelectedTimes(prev => [...prev, internationalSlot])
		}
	}
const handleSave = async () => {
	const dataToSend = { slots: selectedTimes }

	try {
		await setAvailabilities(dataToSend)
		alert('Данные успешно сохранены!')

		// После успешного сохранения обновляем данные
		const response = await getMyAvailabilities()
		const slotsForSelectedDate = response?.filter(slot =>
			dayjs(slot.start).isSame(selectedDate, 'day')
		)

		setAvailableSlots(slotsForSelectedDate)
		setSelectedTimes(slotsForSelectedDate)
	} catch (error) {
		console.error('Ошибка:', error)
		alert('Произошла ошибка при сохранении данных.')
	}
}

	
const formatToLocalTime = internationalTime => {
	return dayjs.utc(internationalTime).local().format('HH:mm')
}

	return (
		<Box sx={{ padding: 2, maxWidth: 600, margin: 'auto' }}>
			{/* Переключатель шага времени */}
			<FormControlLabel
				control={<Switch color='primary' />}
				label='30 минут'
				sx={{ marginBottom: 2 }}
			/>

			{/* Календарь */}
			<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ru'>
				<DateCalendar
					value={selectedDate}
					onChange={handleDateChange}
					renderLoading={() => <DayCalendarSkeleton />}
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
			</LocalizationProvider>

			{/* Временные слоты */}
			<Box sx={{ marginTop: 4 }}>
				<TimeSlotAccordion
					title='Утро'
					times={morningTimes}
					selectedTimes={selectedTimes}
					handleTimeClick={handleTimeClick}
					availableSlots={availableSlots}
					formatToLocalTime={formatToLocalTime}
				/>
				<TimeSlotAccordion
					title='День'
					times={dayTimes}
					selectedTimes={selectedTimes}
					handleTimeClick={handleTimeClick}
					availableSlots={availableSlots}
					formatToLocalTime={formatToLocalTime}
				/>
				<TimeSlotAccordion
					title='Вечер'
					times={eveningTimes}
					selectedTimes={selectedTimes}
					handleTimeClick={handleTimeClick}
					availableSlots={availableSlots}
					formatToLocalTime={formatToLocalTime}
				/>
			</Box>

			{/* Кнопка "Сохранить" */}
			<Button
				variant='contained'
				onClick={handleSave}
				sx={{
					backgroundColor: '#4caf50',
					color: '#fff',
					marginTop: 0,
					'&:hover': {
						backgroundColor: '#388e3c',
					},
				}}
			>
				Сохранить
			</Button>
		</Box>
	)
}

export default CustomCalendar
