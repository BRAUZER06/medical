import React from 'react'
import PopularTopics from './components/PopularTopics/PopularTopics'
import DoctorsList from './components/DoctorsList/DoctorsList'


export default function Home() {
	return (
		<div>
			<PopularTopics />
			<DoctorsList />
		</div>
	)
}
