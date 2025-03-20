import React from 'react'
import styles from './Home.module.scss'
import Home from '../../features/Home/Home'
import WorkSchedulePicker from '../../components/WorkSchedulePicker/WorkSchedulePicker'
import PatientAppointmentScheduler from '../../components/PatientAppointmentScheduler/PatientAppointmentScheduler'

export default function HomePages() {
  return (
		<>
			{/* <Home /> */}
			<WorkSchedulePicker />
			{/* <PatientAppointmentScheduler /> */}
		</>
	)
}
