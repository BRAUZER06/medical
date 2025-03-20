import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
	Avatar,
	Typography,
	Box,
	Paper,
	Button,
	TextField,
} from '@mui/material'
import styles from './UserProfile.module.scss'
import PatientHistory from '../../../components/PatientHistory/PatientHistory'
import { fetchCurrentUser, updateUserProfile, User } from '../../../api/profile'
import { logout } from '../../Authentication/authSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function UserProfile() {
	const queryClient = useQueryClient()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const {
		data: userData,
		isLoading,
		isError,
	} = useQuery<User>({
		queryKey: ['currentUser'],
		queryFn: fetchCurrentUser,
	})

	// Мутация для обновления данных пользователя
	const updateUserMutation = useMutation({
		mutationFn: updateUserProfile,
		onSuccess: updatedUser => {
			queryClient.setQueryData(['currentUser'], updatedUser)
			setIsEditing(false)
		},
		onError: error => {
			console.error('Ошибка при обновлении данных:', error)
		},
	})

	const [isEditing, setIsEditing] = useState(false) // Режим редактирования
	const [user, setUser] = useState<User>({
		id: 0,
		email: '',
		created_at: '',
		updated_at: '',
		role: '',
		last_name: '',
		first_name: '',
		middle_name: '',
		phone: '',
		date_of_birth: '',
		gender: '',
		specialization: '',
		bio: '',
		experience: null,
		description_for_patient: null,
		medical_history: null,
		created_date: '',
	})

	useEffect(() => {
		if (userData) {
			setUser({
				id: userData.id,
				email: userData.email,
				created_at: userData.created_at,
				updated_at: userData.updated_at,
				role: userData.role,
				last_name: userData.last_name,
				first_name: userData.first_name,
				middle_name: userData.middle_name,
				phone: userData.phone,
				date_of_birth: userData.date_of_birth,
				gender: userData.gender,
				specialization: userData.specialization,
				bio: userData.bio,
				experience: userData.experience,
				description_for_patient: userData.description_for_patient,
				medical_history: userData.medical_history,
				created_date: userData.created_date,
			})
		}
	}, [userData])

	// Обработка изменений в полях
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setUser(prevUser => ({ ...prevUser, [name]: value }))
	}

	// Сохранение изменений
	const handleSave = async () => {
		const userData = {
			// first_name: user.first_name,
			// last_name: user.last_name,
			// middle_name: user.middle_name,
			// phone: user.phone,
			// date_of_birth: user.date_of_birth,
			// gender: user.gender,
			// bio: user.bio,
			// specialization: user.specialization,

			id: user.id,
			email: user.email,
			last_name: user.last_name,
			first_name: user.first_name,
			middle_name: user.middle_name,
			phone: user.phone,
			date_of_birth: user.date_of_birth,
			gender: user.gender,
			specialization: user.specialization,
			bio: user.bio,
			experience: user.experience,
			description_for_patient: user.description_for_patient,
			medical_history: user.medical_history,
		}

		updateUserMutation.mutate(userData) // Вызов мутации
	}

	const toggleEditing = () => {
		setIsEditing(!isEditing)
	}

	// Обработка выхода из системы
	const handleLogout = () => {
		dispatch(logout())
		navigate('/login')
	}
	// Пример данных о посещениях
	const visits = [
		{
			doctorName: 'Алексей Петров',
			specialty: 'Кардиолог',
			date: '2025-02-15',
			notes: 'Рекомендуется пройти дополнительные обследования.',
		},
		{
			doctorName: 'Мария Сидорова',
			specialty: 'Гинеколог',
			date: '2025-01-10',
			notes: 'Рекомендации по лечению и профилактике.',
		},
		{
			doctorName: 'Алексей Сидорова',
			specialty: 'Гау',
			date: '2025-01-10',
			notes: 'Лечись, гомункул ',
		},
	]

	// Отображение загрузки или ошибки
	if (isLoading) return <div>Загрузка...</div>
	if (isError) return <div>Ошибка при загрузке данных</div>
	return (
		<Box className={styles.profileWrapper}>
			<Paper className={styles.profileCard}>
				{/* Заголовок профиля */}
				<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
					{/* Заголовок профиля */}
					<Typography variant='h4' gutterBottom>
						Профиль пользователя
					</Typography>

					<Button
						sx={{ alignSelf: 'self-start' }}
						variant='text'
						color='error'
						onClick={handleLogout}
					>
						Выйти
					</Button>
				</Box>
				{/* Аватар и имя */}
				<Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
					<Avatar sx={{ width: 100, height: 100, marginRight: 2 }}>
						{user.first_name[0]}
						{user.last_name[0]}
					</Avatar>
					<Box>
						<Typography variant='h5'>
							{user.first_name} {user.last_name}
						</Typography>
						<Typography variant='subtitle1' color='textSecondary'>
							Роль: {user.role === 'doctor' ? 'Доктор' : 'Пациент'}
						</Typography>
					</Box>
				</Box>

				{/* Кнопка редактирования */}
				<Button
					variant='contained'
					color='primary'
					onClick={isEditing ? handleSave : toggleEditing}
					sx={{ marginBottom: 3 }}
				>
					{isEditing ? 'Сохранить' : 'Редактировать'}
				</Button>

				{/* Основная информация */}
				<Paper sx={{ padding: 2, marginBottom: 3 }}>
					<Typography variant='h6' gutterBottom>
						Основная информация
					</Typography>
					{isEditing ? (
						<>
							<TextField
								label='Имя'
								name='first_name'
								value={user.first_name}
								onChange={handleInputChange}
								fullWidth
								margin='normal'
							/>
							<TextField
								label='Фамилия'
								name='last_name'
								value={user.last_name}
								onChange={handleInputChange}
								fullWidth
								margin='normal'
							/>
							<TextField
								label='Отчество'
								name='middle_name'
								value={user.middle_name || ''}
								onChange={handleInputChange}
								fullWidth
								margin='normal'
							/>
							<TextField
								label='Телефон'
								name='phone'
								value={user.phone}
								onChange={handleInputChange}
								fullWidth
								margin='normal'
							/>
						</>
					) : (
						<>
							<Box sx={{ marginBottom: 2 }}>
								<Typography variant='subtitle2'>Имя</Typography>
								<Typography variant='body1'>{user.first_name}</Typography>
							</Box>
							<Box sx={{ marginBottom: 2 }}>
								<Typography variant='subtitle2'>Фамилия</Typography>
								<Typography variant='body1'>{user.last_name}</Typography>
							</Box>
							<Box sx={{ marginBottom: 2 }}>
								<Typography variant='subtitle2'>Отчество</Typography>
								<Typography variant='body1'>
									{user.middle_name || 'Не указано'}
								</Typography>
							</Box>
							<Box sx={{ marginBottom: 2 }}>
								<Typography variant='subtitle2'>Телефон</Typography>
								<Typography variant='body1'>{user.phone}</Typography>
							</Box>
						</>
					)}
				</Paper>

				{/* Поля для пациента */}
				{user.role === 'patient' && (
					<Paper sx={{ padding: 2, marginBottom: 3 }}>
						<Typography variant='h6' gutterBottom>
							Информация о пациентe:
						</Typography>
						{isEditing ? (
							<>
								<TextField
									label='Дата рождения'
									name='date_of_birth'
									value={user.date_of_birth || ''}
									onChange={handleInputChange}
									fullWidth
									margin='normal'
									type='date'
									InputLabelProps={{ shrink: true }}
								/>
								<TextField
									label='Пол'
									name='gender'
									value={user.gender || ''}
									onChange={handleInputChange}
									fullWidth
									margin='normal'
									select
									SelectProps={{ native: true }}
								>
									<option value='male'>Мужской</option>
									<option value='female'>Женский</option>
								</TextField>
							</>
						) : (
							<>
								<Box sx={{ marginBottom: 2 }}>
									<Typography variant='subtitle2'>Дата рождения</Typography>
									<Typography variant='body1'>
										{user.date_of_birth || 'Не указано'}
									</Typography>
								</Box>
								<Box sx={{ marginBottom: 2 }}>
									<Typography variant='subtitle2'>Пол</Typography>
									<Typography variant='body1'>
										{user.gender || 'Не указано'}
									</Typography>
								</Box>
								<PatientHistory visits={visits} />
							</>
						)}
					</Paper>
				)}

				{/* Поля для доктора */}
				{user.role === 'doctor' && (
					<Paper sx={{ padding: 2, marginBottom: 3 }}>
						<Typography variant='h6' gutterBottom>
							Информация о докторе:
						</Typography>
						{isEditing ? (
							<>
								<TextField
									label='Дата рождения'
									name='date_of_birth'
									value={user.date_of_birth || ''}
									onChange={handleInputChange}
									fullWidth
									margin='normal'
									type='date'
									InputLabelProps={{ shrink: true }}
								/>
								<TextField
									label='Пол'
									name='gender'
									value={user.gender || ''}
									onChange={handleInputChange}
									fullWidth
									margin='normal'
									select
									SelectProps={{ native: true }}
								>
									<option value='male'>Мужской</option>
									<option value='female'>Женский</option>
								</TextField>
								<TextField
									label='Биография'
									name='bio'
									value={user.bio || ''}
									onChange={handleInputChange}
									fullWidth
									margin='normal'
									multiline
									rows={4}
								/>
								<TextField
									label='Специализация'
									name='specialization'
									value={user.specialization || ''}
									onChange={handleInputChange}
									fullWidth
									margin='normal'
								/>
								<TextField
									label='Опыт работы (лет)'
									name='experience'
									value={user.experience || ''}
									onChange={handleInputChange}
									fullWidth
									margin='normal'
									type='number'
								/>
							</>
						) : (
							<>
								<Box sx={{ marginBottom: 2 }}>
									<Typography variant='subtitle2'>Дата рождения</Typography>
									<Typography variant='body1'>
										{user.date_of_birth || 'Не указано'}
									</Typography>
								</Box>
								<Box sx={{ marginBottom: 2 }}>
									<Typography variant='subtitle2'>Пол</Typography>
									<Typography variant='body1'>
										{user.gender || 'Не указано'}
									</Typography>
								</Box>
								<Box sx={{ marginBottom: 2 }}>
									<Typography variant='subtitle2'>Биография</Typography>
									<Typography variant='body1'>
										{user.bio || 'Не указано'}
									</Typography>
								</Box>
								<Box sx={{ marginBottom: 2 }}>
									<Typography variant='subtitle2'>Специализация</Typography>
									<Typography variant='body1'>
										{user.specialization || 'Не указано'}
									</Typography>
								</Box>
								<Box sx={{ marginBottom: 2 }}>
									<Typography variant='subtitle2'>Опыт работы</Typography>
									<Typography variant='body1'>
										{user.experience || 'Не указано'}
									</Typography>
								</Box>
							</>
						)}
					</Paper>
				)}
			</Paper>
		</Box>
	)
}
