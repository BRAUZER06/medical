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


import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone'
import BadgeIcon from '@mui/icons-material/Badge'
import InputAdornment from '@mui/material/InputAdornment'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import WcIcon from '@mui/icons-material/Wc'


import InfoIcon from '@mui/icons-material/Info'
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation'
import WorkIcon from '@mui/icons-material/Work'

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
				avatar_url:userData.avatar_url,
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
				<Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
					<Avatar
						src={user.avatar_url || undefined}
						sx={{ width: 100, height: 100, marginRight: 2, fontSize: 32 }}
					>
						{!user.avatar_url && (
							<>
								{user.first_name?.[0] || ''}
								{user.last_name?.[0] || ''}
							</>
						)}
					</Avatar>

					<Box>
						<Typography variant="h5">
							{user.first_name} {user.last_name}
						</Typography>
						<Typography variant="subtitle1" color="textSecondary">
							Роль: {user.role === 'doctor' ? 'Доктор' : 'Пациент'}
						</Typography>
					</Box>
				</Box>
				{/* Кнопка редактирования */}
				<Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
					<Button
						variant="contained"
						color={isEditing ? 'success' : 'primary'}
						startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
						onClick={isEditing ? handleSave : toggleEditing}
						sx={{ borderRadius: 2, boxShadow: 2, textTransform: 'none' }}
					>
						{isEditing ? 'Сохранить' : 'Редактировать'}
					</Button>

					<Button
						variant="outlined"
						color="error"
						startIcon={<LogoutIcon />}
						onClick={handleLogout}
						sx={{ borderRadius: 2, boxShadow: 1, textTransform: 'none' }}
					>
						Выйти
					</Button>
				</Box>
				{/* Основная информация */}
				<Paper sx={{ padding: 2, marginBottom: 3 }}>
					<Typography variant="h6" gutterBottom>
						Основная информация
					</Typography>
					{isEditing ? (
						<Box
							sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}
						>
							<TextField
								label="Имя"
								name="first_name"
								value={user.first_name}
								onChange={handleInputChange}
								fullWidth
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<PersonIcon color="action" />
										</InputAdornment>
									),
								}}
							/>
							<TextField
								label="Фамилия"
								name="last_name"
								value={user.last_name}
								onChange={handleInputChange}
								fullWidth
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<PersonIcon color="action" />
										</InputAdornment>
									),
								}}
							/>
							<TextField
								label="Отчество"
								name="middle_name"
								value={user.middle_name || ''}
								onChange={handleInputChange}
								fullWidth
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<BadgeIcon color="action" />
										</InputAdornment>
									),
								}}
							/>
							<TextField
								label="Телефон"
								name="phone"
								value={user.phone}
								onChange={handleInputChange}
								fullWidth
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<PhoneIphoneIcon color="action" />
										</InputAdornment>
									),
								}}
							/>
						</Box>
					) : (
						<Box
							sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}
						>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<PersonIcon color="action" />
								<Box>
									<Typography variant="caption" color="text.secondary">
										Имя
									</Typography>
									<Typography variant="body1">
										{user.first_name || 'Не указано'}
									</Typography>
								</Box>
							</Box>

							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<PersonIcon color="action" />
								<Box>
									<Typography variant="caption" color="text.secondary">
										Фамилия
									</Typography>
									<Typography variant="body1">
										{user.last_name || 'Не указано'}
									</Typography>
								</Box>
							</Box>

							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<BadgeIcon color="action" />
								<Box>
									<Typography variant="caption" color="text.secondary">
										Отчество
									</Typography>
									<Typography variant="body1">
										{user.middle_name || 'Не указано'}
									</Typography>
								</Box>
							</Box>

							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<PhoneIphoneIcon color="action" />
								<Box>
									<Typography variant="caption" color="text.secondary">
										Телефон
									</Typography>
									<Typography variant="body1">
										{user.phone || 'Не указано'}
									</Typography>
								</Box>
							</Box>
						</Box>
					)}
				</Paper>
				{/* Поля для пациента */}

				{user.role === 'patient' && (
					<Paper
						elevation={1}
						sx={{
							p: 2,
							mb: 3,
							borderRadius: 2,
							backgroundColor: '#f9f9f9',
						}}
					>
						<Typography variant="h6" gutterBottom>
							🩺 Информация о пациенте
						</Typography>

						{isEditing ? (
							<Box
								sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
							>
								<TextField
									label="Дата рождения"
									name="date_of_birth"
									value={user.date_of_birth || ''}
									onChange={handleInputChange}
									type="date"
									fullWidth
									InputLabelProps={{ shrink: true }}
									InputProps={{
										startAdornment: (
											<CalendarMonthIcon
												sx={{ mr: 1, color: 'action.active' }}
											/>
										),
									}}
								/>
								<TextField
									label="Пол"
									name="gender"
									value={user.gender || ''}
									onChange={handleInputChange}
									select
									fullWidth
									InputProps={{
										startAdornment: (
											<WcIcon sx={{ mr: 1, color: 'action.active' }} />
										),
									}}
									SelectProps={{ native: true }}
								>
									<option value="">Не указан</option>
									<option value="male">Мужской</option>
									<option value="female">Женский</option>
								</TextField>
							</Box>
						) : (
							<Box
								sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
							>
								<Box sx={{ display: 'flex', gap: 1 }}>
									<CalendarMonthIcon
										sx={{ alignSelf: 'end', color: 'action.active' }}
									/>
									<Box>
										<Typography variant="caption" color="text.secondary">
											Дата рождения
										</Typography>
										<Typography variant="body1">
											{user.date_of_birth || 'Не указано'}
										</Typography>
									</Box>
								</Box>

								<Box sx={{ display: 'flex', gap: 1 }}>
									<WcIcon sx={{ alignSelf: 'end', color: 'action.active' }} />
									<Box>
										<Typography variant="caption" color="text.secondary">
											Пол
										</Typography>
										<Typography variant="body1">
											{user.gender || 'Не указано'}
										</Typography>
									</Box>
								</Box>

								<PatientHistory visits={visits} />
							</Box>
						)}
					</Paper>
				)}
				{/* Поля для доктора */}
				{user.role === 'doctor' && (
					<Paper
						elevation={1}
						sx={{
							p: 2,
							mb: 3,
							borderRadius: 2,
							backgroundColor: '#f9f9f9',
						}}
					>
						<Typography variant="h6" gutterBottom>
							Информация о докторе
						</Typography>

						{isEditing ? (
							<Box
								sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
							>
								<TextField
									label="Дата рождения"
									name="date_of_birth"
									value={user.date_of_birth || ''}
									onChange={handleInputChange}
									type="date"
									fullWidth
									InputLabelProps={{ shrink: true }}
									InputProps={{
										startAdornment: (
											<CalendarMonthIcon
												sx={{ mr: 1, color: 'action.active' }}
											/>
										),
									}}
								/>
								<TextField
									label="Пол"
									name="gender"
									value={user.gender || ''}
									onChange={handleInputChange}
									select
									fullWidth
									InputProps={{
										startAdornment: (
											<WcIcon sx={{ mr: 1, color: 'action.active' }} />
										),
									}}
									SelectProps={{ native: true }}
								>
									<option value="">Не указан</option>
									<option value="male">Мужской</option>
									<option value="female">Женский</option>
								</TextField>
								<TextField
									label="Биография"
									name="bio"
									value={user.bio || ''}
									onChange={handleInputChange}
									fullWidth
									multiline
									rows={4}
									InputProps={{
										startAdornment: (
											<InfoIcon
												sx={{
													mr: 1,
													color: 'action.active',
													alignSelf: 'start',
												}}
											/>
										),
									}}
								/>
								<TextField
									label="Специализация"
									name="specialization"
									value={user.specialization || ''}
									onChange={handleInputChange}
									fullWidth
									InputProps={{
										startAdornment: (
											<MedicalInformationIcon
												sx={{ mr: 1, color: 'action.active' }}
											/>
										),
									}}
								/>
								<TextField
									label="Опыт работы (лет)"
									name="experience"
									value={user.experience || ''}
									onChange={handleInputChange}
									fullWidth
									type="number"
									InputProps={{
										startAdornment: (
											<WorkIcon sx={{ mr: 1, color: 'action.active' }} />
										),
									}}
								/>
							</Box>
						) : (
							<Box
								sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
							>
								<Box sx={{ display: 'flex', gap: 1 }}>
									<CalendarMonthIcon
										sx={{ alignSelf: 'center', color: 'action.active' }}
									/>
									<Box>
										<Typography variant="caption" color="text.secondary">
											Дата рождения
										</Typography>
										<Typography variant="body1">
											{user.date_of_birth || 'Не указано'}
										</Typography>
									</Box>
								</Box>

								<Box sx={{ display: 'flex', gap: 1 }}>
									<WcIcon sx={{ alignSelf: 'center', color: 'action.active' }} />
									<Box>
										<Typography variant="caption" color="text.secondary">
											Пол
										</Typography>
										<Typography variant="body1">
											{user.gender || 'Не указано'}
										</Typography>
									</Box>
								</Box>

								<Box sx={{ display: 'flex', gap: 1 }}>
									<InfoIcon
										sx={{ alignSelf: 'center', color: 'action.active' }}
									/>
									<Box>
										<Typography variant="caption" color="text.secondary">
											Биография
										</Typography>
										<Typography variant="body1">
											{user.bio || 'Не указано'}
										</Typography>
									</Box>
								</Box>

								<Box sx={{ display: 'flex', gap: 1 }}>
									<MedicalInformationIcon
										sx={{ alignSelf: 'center', color: 'action.active' }}
									/>
									<Box>
										<Typography variant="caption" color="text.secondary">
											Специализация
										</Typography>
										<Typography variant="body1">
											{user.specialization || 'Не указано'}
										</Typography>
									</Box>
								</Box>

								<Box sx={{ display: 'flex', gap: 1 }}>
									<WorkIcon sx={{ alignSelf: 'center', color: 'action.active' }} />
									<Box>
										<Typography variant="caption" color="text.secondary">
											Опыт работы
										</Typography>
										<Typography variant="body1">
											{user.experience || 'Не указано'}
										</Typography>
									</Box>
								</Box>
							</Box>
						)}
					</Paper>
				)}
			</Paper>
		</Box>
	)
}
