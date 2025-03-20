// import { Button } from "@mui/material"

// export const TimeSlotButton = ({ time, selectedTimes, handleTimeClick }) => {
//   return (
//     <Button
//       variant={selectedTimes.includes(time) ? 'contained' : 'outlined'}
//       onClick={() => handleTimeClick(time)}
//       sx={{

//         minWidth: '100px',
//         maxWidth:"100px",
//         width:'100%',
//         backgroundColor: selectedTimes.includes(time) ? '#ffeb3b' : '#eaeef4',
//         border: 'none',
//         color: selectedTimes.includes(time) ? '#000' : '#000',
//         borderRadius: '20px',
//         padding: '6px 16px',
//         '&:hover': {
//           backgroundColor: '#ffeb3b',
//         },
//       }}
//     >
//       {time}
//     </Button>
//   )
// }
import React from 'react'
import { Button } from '@mui/material'

export const TimeSlotButton = ({
	timeSlot,
	isSelected,
	handleTimeClick,
	isBooked,
}) => {
	return (
		<Button
			variant={isSelected ? 'contained' : 'outlined'}
			onClick={() => !isBooked && handleTimeClick(timeSlot)} // Клик работает только если слот не забронирован
			disabled={isBooked} // Заблокировать кнопку, если слот забронирован
			sx={{
				minWidth: '120px',
				borderRadius: '8px',
				textTransform: 'none',
				backgroundColor: isBooked
					? '#ffebee' // Красный фон для забронированных слотов
					: isSelected
					? '#4caf50' // Зеленый фон для выбранных слотов
					: 'transparent',
				color: isBooked
					? '#d32f2f' // Красный текст для забронированных слотов
					: isSelected
					? '#fff' // Белый текст для выбранных слотов
					: '#000',
				'&:hover': {
					backgroundColor: isBooked
						? '#ffebee' // Забронированные слоты не меняют цвет при наведении
						: isSelected
						? '#388e3c' // Темно-зеленый для выбранных слотов
						: '#f0f0f0', // Серый для остальных
				},
				'&:disabled': {
					opacity: 1, // Забронированные слоты не затемняются
					cursor: 'not-allowed',
				},
			}}
		>
			{timeSlot.start} - {timeSlot.end}
		</Button>
	)
}