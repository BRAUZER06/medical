// import React from 'react';
// import {
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Typography,
//   Grid,
// } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { TimeSlotButton } from './TimeSlotButton';

// export const TimeSlotAccordion = ({
//   title,
//   times,
//   selectedTimes,
//   handleTimeClick,
//   availableSlots,
//   formatToLocalTime,
// }) => {
//   return (
//     <Accordion defaultExpanded sx={{ mb: 2, borderRadius: '12px', boxShadow: '0 1px 5px rgba(0,0,0,0.1)' }}>
//       <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//         <Typography fontWeight="bold">{title}</Typography>
//       </AccordionSummary>
//       <AccordionDetails>
//         <Grid container spacing={1}>
//           {times.map((timeSlot) => {
//             const isAvailable = availableSlots.some(
//               (slot) =>
//                 formatToLocalTime(slot.start) === timeSlot.start &&
//                 formatToLocalTime(slot.end) === timeSlot.end
//             );

//             const isSelected = selectedTimes.some(
//               (slot) =>
//                 formatToLocalTime(slot.start) === timeSlot.start &&
//                 formatToLocalTime(slot.end) === timeSlot.end
//             );

//             return (
//               <Grid item key={`${timeSlot.start}-${timeSlot.end}`}>
//                 <TimeSlotButton
//                   timeSlot={timeSlot}
//                   isSelected={isSelected}
//                   handleTimeClick={handleTimeClick}
//                   isAvailable={isAvailable}
//                 />
//               </Grid>
//             );
//           })}
//         </Grid>
//       </AccordionDetails>
//     </Accordion>
//   );
// };

import React from 'react'
import {
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Typography,
	Grid,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { TimeSlotButton } from './TimeSlotButton'

export const TimeSlotAccordion = ({
	title,
	times,
	selectedTimes,
	handleTimeClick,
	availableSlots,
	formatToLocalTime,
}) => {
	return (
		<Accordion
			defaultExpanded
			sx={{
				mb: 2,
				borderRadius: '12px',
				boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
			}}
		>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<Typography fontWeight='bold'>{title}</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<Grid container spacing={1}>
					{times.map(timeSlot => {
						const isBooked = availableSlots.some(
							slot =>
								formatToLocalTime(slot.start) === timeSlot.start &&
								formatToLocalTime(slot.end) === timeSlot.end &&
								slot.booked
						)

						const isSelected = selectedTimes.some(
							slot =>
								formatToLocalTime(slot.start) === timeSlot.start &&
								formatToLocalTime(slot.end) === timeSlot.end
						)

						return (
							<Grid item key={`${timeSlot.start}-${timeSlot.end}`}>
								<TimeSlotButton
									timeSlot={timeSlot}
									isSelected={isSelected}
									handleTimeClick={handleTimeClick}
									isBooked={isBooked}
								/>
							</Grid>
						)
					})}
				</Grid>
			</AccordionDetails>
		</Accordion>
	)
}