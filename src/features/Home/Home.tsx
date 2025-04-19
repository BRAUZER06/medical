import React from 'react'
import PopularTopics from './components/PopularTopics/PopularTopics'
import DoctorsList from './components/DoctorsList/DoctorsList'
import RecommendedDoctors from './components/RecommendedDoctors/RecommendedDoctors'


export default function Home() {
	return (
		<div>
			<PopularTopics />
			<DoctorsList />
			<RecommendedDoctors/>
		</div>
	)
}
