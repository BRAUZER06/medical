import { useState, useEffect } from 'react'
import { Box, Button, Tooltip, Typography } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import {
	getMyAvailabilities,
	setAvailabilities,
	deleteAvailabilities,
} from '../../api/calendar'

dayjs.extend(utc)
dayjs.extend(timezone)

export default function DoctorSchedule() {
	const [selectedDate, setSelectedDate] = useState(dayjs.utc())
	const [apiSlots, setApiSlots] = useState([])
	const [slots, setSlots] = useState([])
	const [mode, setMode] = useState(null) // 'add' | 'delete' | null

	useEffect(() => {
		fetchSlots()
	}, [])

	const fetchSlots = async () => {
		try {
			const data = await getMyAvailabilities()
			setApiSlots(data)
			generateFullDaySlots(selectedDate, data)
		} catch (err) {
			console.error('Ошибка загрузки слотов:', err)
		}
	}

	const generateFullDaySlots = (date, apiData) => {
		const startHour = 6
		const endHour = 24
		const generated = []

		for (let hour = startHour; hour < endHour; hour++) {
			for (let min = 0; min < 60; min += 30) {
				const slotStart = dayjs
					.utc(date)
					.hour(hour)
					.minute(min)
					.second(0)
					.millisecond(0)
				const slotEnd = slotStart.add(30, 'minute')

				const existing = apiData.find(apiSlot =>
					dayjs.utc(apiSlot.start).isSame(slotStart)
				)

				generated.push({
					id: existing ? existing.id : `${slotStart.toISOString()}`,
					start: slotStart.toISOString(),
					end: slotEnd.toISOString(),
					booked: existing ? existing.booked : false,
					booking: existing ? existing.booking : null,
					selected: existing ? true : false,
					isFromApi: !!existing,
				})
			}
		}
		setSlots(generated)
	}

	const handleToggleSlot = slotId => {
		setSlots(prev =>
			prev.map(slot => {
				if (slot.id !== slotId) return slot
				if (slot.booked) return slot

				if (mode === 'add' && !slot.selected) return { ...slot, selected: true }
				if (mode === 'delete' && slot.selected)
					return { ...slot, selected: false }

				return slot
			})
		)
	}

	const getSlotsByPeriod = (periodStart, periodEnd) => {
		return slots.filter(slot => {
			const start = dayjs.utc(slot.start)
			return (
				start.isSame(selectedDate, 'day') &&
				start.hour() >= periodStart &&
				start.hour() < periodEnd
			)
		})
	}

	const renderSlot = slot => {
		const startTime = dayjs.utc(slot.start).format('HH:mm')
		const isBooked = slot.booked
		const isSelected = slot.selected

		let disabled = isBooked
		if (mode === 'add') disabled = isSelected || isBooked
		if (mode === 'delete') disabled = !slot.isFromApi || isBooked

		return (
			<Tooltip
				key={slot.id}
				title={isBooked && slot.booking ? slot.booking.comment : ''}
				arrow
				placement="top"
			>
				<Box
					sx={{
						p: 1,
						m: 0.5,
						border: '1px solid',
						borderColor: isBooked
							? 'grey.400'
							: isSelected
							? 'primary.main'
							: 'grey.300',
						backgroundColor: disabled
							? 'grey.200'
							: isSelected
							? 'primary.light'
							: 'white',
						borderRadius: 2,
						cursor: disabled ? 'not-allowed' : mode ? 'pointer' : 'default',
						minWidth: '80px',
						textAlign: 'center',
						opacity: disabled ? 0.6 : 1,
					}}
					onClick={() => !disabled && handleToggleSlot(slot.id)}
				>
					{startTime}
				</Box>
			</Tooltip>
		)
	}

	const periods = [
		{ label: 'Утро', start: 6, end: 12 },
		{ label: 'День', start: 12, end: 18 },
		{ label: 'Вечер', start: 18, end: 24 },
	]

	const handleSave = async () => {
		try {
			if (mode === 'add') {
				const newSlots = slots
					.filter(slot => slot.selected)
					.map(({ selected, isFromApi, ...rest }) => rest)
				await setAvailabilities({ slots: newSlots })
			} else if (mode === 'delete') {
				// Самое главное: находим именно снятые пользователем слоты из API
				const toDelete = apiSlots
					.filter(apiSlot => {
						const currentSlot = slots.find(s => s.id === apiSlot.id)
						return currentSlot && !currentSlot.selected
					})
					.map(slot => slot.id)

				if (toDelete.length > 0) {
					await deleteAvailabilities({ slot_ids: toDelete })
				}
			}
			setMode(null)
			fetchSlots()
		} catch (err) {
			console.error('Ошибка при сохранении:', err)
		}
	}

	const handleDateChange = newDate => {
		const updatedDate = newDate.utc()
		setSelectedDate(updatedDate)
		generateFullDaySlots(updatedDate, apiSlots)
	}

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<Box sx={{ display: 'flex', gap: 4 }}>
				<DateCalendar
					value={selectedDate}
					onChange={handleDateChange}
					disabled={!!mode}
				/>

				<Box sx={{ flexGrow: 1 }}>
					{periods.map(period => (
						<Box key={period.label} sx={{ mb: 2 }}>
							<Typography variant="h6">{period.label}</Typography>
							<Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
								{getSlotsByPeriod(period.start, period.end).map(renderSlot)}
							</Box>
						</Box>
					))}

					{!mode && (
						<>
							<Button
								variant="contained"
								onClick={() => setMode('add')}
								sx={{ mr: 2 }}
							>
								Добавить
							</Button>
							<Button variant="contained" onClick={() => setMode('delete')}>
								Удалить
							</Button>
						</>
					)}

					{mode && (
						<Button variant="contained" onClick={handleSave}>
							Сохранить
						</Button>
					)}
				</Box>
			</Box>
		</LocalizationProvider>
	)
}
