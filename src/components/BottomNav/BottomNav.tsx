import React, { useState, useEffect } from 'react'
import {
	BottomNavigation,
	BottomNavigationAction,
	Paper,
	Box,
	alpha,
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'
import ChatIcon from '@mui/icons-material/Chat'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { useNavigate, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchCurrentUser, User } from '../../api/profile'

type NavItem = {
	path: string
	label: string
	icon: React.ReactElement
	allowedRoles?: ('patient' | 'doctor')[]
}

const BottomNav = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const [activeTab, setActiveTab] = useState<string>('/')

	const { data: user } = useQuery<User>({
		queryKey: ['currentUser'],
		queryFn: fetchCurrentUser,
	})

	const navItems: NavItem[] = [
		{ path: '/', label: 'Главная', icon: <HomeIcon /> },
		{ path: '/doctors', label: 'Врачи', icon: <MedicalServicesIcon /> },
		{ path: '/chats', label: 'Чаты', icon: <ChatIcon /> },
		{
			path: '/calendar',
			label: 'Календарь',
			icon: <CalendarTodayIcon />,
			allowedRoles: ['doctor'],
		},
		{ path: '/profile', label: 'Профиль', icon: <AccountCircleIcon /> },
	]

	useEffect(() => {
		const currentItem = navItems.find(
			item =>
				location.pathname === item.path ||
				(item.path !== '/' && location.pathname.startsWith(item.path))
		)
		if (currentItem) {
			setActiveTab(currentItem.path)
		}
	}, [location.pathname])

	const filteredNavItems = navItems.filter(
		item =>
			!item.allowedRoles ||
			item.allowedRoles.includes(user?.role as 'patient' | 'doctor')
	)

	return (
		<Box sx={{ pb: 7 }}>
			<Paper
				sx={{
					position: 'fixed',
					bottom: 0,
					left: 0,
					right: 0,
					zIndex: 1000,
					background: theme => alpha(theme.palette.background.paper, 0.8),
					backdropFilter: 'blur(10px)',
					borderTop: '1px solid',
					borderColor: 'divider',
					maxWidth: 600,
					mx: 'auto',
				}}
				elevation={0}
			>
				<BottomNavigation
					value={activeTab}
					showLabels
					sx={{
						'& .MuiBottomNavigationAction-root': {
							minWidth: '60px',
							maxWidth: '100%',
							padding: '8px 4px',
							transition: 'all 0.2s ease',
							'&:hover': {
								backgroundColor: theme =>
									alpha(theme.palette.primary.main, 0.1),
								'& .MuiBottomNavigationAction-label': {
									transform: 'translateY(-2px)',
									opacity: 1,
								},
								'& .MuiSvgIcon-root': {
									transform: 'scale(1.1)',
								},
							},
							'&.Mui-selected': {
								color: 'primary.main',
								'& .MuiSvgIcon-root': {
									transform: 'scale(1.15)',
								},
							},
						},
						'& .MuiBottomNavigationAction-label': {
							fontSize: '0.75rem',
							whiteSpace: 'nowrap',
							mt: 0.5,
							transition: 'all 0.2s ease',
							opacity: 0.9,
							'&.Mui-selected': {
								fontSize: '0.75rem',
								fontWeight: 500,
							},
						},
						'& .MuiSvgIcon-root': {
							transition: 'transform 0.2s ease',
						},
					}}
				>
					{filteredNavItems.map(item => (
						<BottomNavigationAction
							key={item.path}
							value={item.path}
							onClick={() => navigate(item.path)}
							label={item.label}
							icon={item.icon}
							disableRipple
							sx={{
								'&:hover': {
									backgroundColor: 'transparent',
								},
							}}
						/>
					))}
				</BottomNavigation>
			</Paper>
		</Box>
	)
}

export default BottomNav
