import React, { useState } from 'react'
import {
	BottomNavigation,
	BottomNavigationAction,
	Paper,
	Box,
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'
import ChatIcon from '@mui/icons-material/Chat'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday' // Иконка календаря
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux' 
import { fetchCurrentUser, User } from '../../api/profile'
import { useQuery } from '@tanstack/react-query'

const BottomNav = () => {
	const [value, setValue] = useState(0)
	const navigate = useNavigate()

	// Получаем данные пользователя из Redux
const { data: user } = useQuery<User>({
	queryKey: ['currentUser'],
	queryFn: fetchCurrentUser,
})
	console.log('user', user)
	

	const handleNavigation = (newValue: number) => {
		setValue(newValue)

		switch (newValue) {
			case 0:
				navigate('/')
				break
			case 1:
				navigate('/doctors')
				break
			case 2:
				navigate('/chats')
				break
			case 3:
				navigate('/profile')
				break
			case 4:
				navigate('/calendar') // Добавляем маршрут для календаря
				break
			default:
				break
		}
	}

	// Пример данных для календаря

	return (
		<Box>
			<Paper
				sx={{
					position: 'fixed',
					bottom: 0,
					left: 0,
					right: 0,
					zIndex: 1000,
				}}
				elevation={3}
			>
				<BottomNavigation
					value={value}
					onChange={(event, newValue) => handleNavigation(newValue)}
					showLabels
				>
					<BottomNavigationAction sx={{padding:'0px 5px'}} label='Главная' icon={<HomeIcon />} />
					<BottomNavigationAction sx={{padding:'0px 5px'}} 
						label='Врачи'
						icon={<MedicalServicesIcon />}
					/>
					<BottomNavigationAction sx={{padding:'0px 5px'}} label='Чаты' icon={<ChatIcon />} />
					{/* {user?.role === 'doctor' && (
						<BottomNavigationAction sx={{padding:'0px 5px'}}
							label='Календарь'
							icon={<CalendarTodayIcon />}
						/>
					)} */}
					<BottomNavigationAction sx={{padding:'0px 5px'}}
						label='Профиль'
						icon={<AccountCircleIcon />}
					/>

					{/* Добавляем иконку календаря */}
				</BottomNavigation>
			</Paper>
		</Box>
	)
}

export default BottomNav
