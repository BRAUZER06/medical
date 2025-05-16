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
import {
	deletedPatientRecord,
	getPatientRecord,
	updatePatientRecord,
} from '../../../api/pacoent'
import { createOrFetchChat } from '../../../api/chats'

export default function UserProfile() {
	const queryClient = useQueryClient()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [appointments, setAppointments] = useState([])
	const [editingAppointmentId, setEditingAppointmentId] = useState(null)
	const [appointmentNotes, setAppointmentNotes] = useState('')

	const {
		data: userData,
		isLoading,
		isError,
	} = useQuery<User>({
		queryKey: ['currentUser'],
		queryFn: fetchCurrentUser,
	})

	const fetchAppointments = async () => {
		try {
			const data = await getPatientRecord()
			console.log('data', data)

			setAppointments(data)
		} catch (error) {
			console.error('Ошибка загрузки записей:', error)
		}
	}

	useEffect(() => {
		fetchAppointments()
	}, [])

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
				avatar_url: userData.avatar_url,
				created_at: userData.created_at,
				updated_at: userData.updated_at,
				role: userData.role,
				workplace: userData.workplace,
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

	const handleInputChangePlaceOfWork = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const { name, value } = e.target
		setUser(prevUser => ({ ...prevUser, [name]: value }))
	}

	const handleStartChat = async (userId: number) => {
		try {
			const chat = await createOrFetchChat(userId)
			navigate(`/chats/${chat.id}`)
		} catch (error) {
			console.error('Не удалось открыть чат:', error)
		}
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
			workplace: user.workplace,
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

	// Функция для преобразования ISO строки в формат "HH:MM - HH:MM"
	const formatAppointmentTime = (start: string, end: string) => {
		const startTime = new Date(start).toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit',
		})
		const endTime = new Date(end).toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit',
		})
		return `${startTime} - ${endTime}`
	}
	const sortedAppointments = [...appointments].sort(
		(a, b) =>
			new Date(b.start_datetime).getTime() -
			new Date(a.start_datetime).getTime()
	)

	const isAppointmentExpired = (appointmentEndTime: string) => {
		const now = new Date()
		const endTime = new Date(appointmentEndTime)
		return now > endTime
	}

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
						<Typography variant='h5'>
							{user.first_name} {user.last_name}
						</Typography>
						<Typography variant='subtitle1' color='textSecondary'>
							Роль: {user.role === 'doctor' ? 'Доктор' : 'Пациент'}
						</Typography>
					</Box>
				</Box>
				{/* Кнопка редактирования */}
				<Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
					<Button
						variant='contained'
						color={isEditing ? 'success' : 'primary'}
						startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
						onClick={isEditing ? handleSave : toggleEditing}
						sx={{ borderRadius: 2, boxShadow: 2, textTransform: 'none' }}
					>
						{isEditing ? 'Сохранить' : 'Редактировать'}
					</Button>

					<Button
						variant='outlined'
						color='error'
						startIcon={<LogoutIcon />}
						onClick={handleLogout}
						sx={{ borderRadius: 2, boxShadow: 1, textTransform: 'none' }}
					>
						Выйти
					</Button>
				</Box>
				{/* Основная информация */}
				<Paper sx={{ padding: 2, marginBottom: 3 }}>
					<Typography variant='h6' gutterBottom>
						Основная информация:
					</Typography>
					{isEditing ? (
						<Box
							sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}
						>
							<TextField
								label='Имя'
								name='first_name'
								value={user.first_name}
								onChange={handleInputChange}
								fullWidth
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>
											<PersonIcon color='action' />
										</InputAdornment>
									),
								}}
							/>
							<TextField
								label='Фамилия'
								name='last_name'
								value={user.last_name}
								onChange={handleInputChange}
								fullWidth
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>
											<PersonIcon color='action' />
										</InputAdornment>
									),
								}}
							/>
							<TextField
								label='Отчество'
								name='middle_name'
								value={user.middle_name || ''}
								onChange={handleInputChange}
								fullWidth
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>
											<BadgeIcon color='action' />
										</InputAdornment>
									),
								}}
							/>
							{/* <TextField
								label='Телефон'
								name='phone'
								value={user.phone}
								onChange={handleInputChange}
								fullWidth
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>
											<PhoneIphoneIcon color='action' />
										</InputAdornment>
									),
								}}
							/> */}
						</Box>
					) : (
						<Box
							sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}
						>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<PersonIcon color='action' />
								<Box>
									<Typography variant='caption' color='text.secondary'>
										Имя
									</Typography>
									<Typography variant='body1'>
										{user.first_name || 'Не указано'}
									</Typography>
								</Box>
							</Box>

							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<PersonIcon color='action' />
								<Box>
									<Typography variant='caption' color='text.secondary'>
										Фамилия
									</Typography>
									<Typography variant='body1'>
										{user.last_name || 'Не указано'}
									</Typography>
								</Box>
							</Box>

							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<BadgeIcon color='action' />
								<Box>
									<Typography variant='caption' color='text.secondary'>
										Отчество
									</Typography>
									<Typography variant='body1'>
										{user.middle_name || 'Не указано'}
									</Typography>
								</Box>
							</Box>

							{/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<PhoneIphoneIcon color='action' />
								<Box>
									<Typography variant='caption' color='text.secondary'>
										Телефон
									</Typography>
									<Typography variant='body1'>
										{user.phone || 'Не указано'}
									</Typography>
								</Box>
							</Box> */}
						</Box>
					)}
				</Paper>
				{/* Поля для пациента */}

				{/* Блок записей к врачу */}
				<Paper sx={{ boxShadow: 'none', marginBottom: 3 }}>
					<Typography variant='h6' gutterBottom>
						Мои записи к врачу:
					</Typography>

					{sortedAppointments.length > 0 ? (
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
							{sortedAppointments.map(appointment => {
								const isExpired = isAppointmentExpired(appointment.end_datetime)
								return (
									<Paper
										key={appointment.appointment_id}
										sx={{
											p: 2,
											display: 'flex',
											flexDirection: 'column',
											gap: 1,
											borderLeft: '4px solid',
											borderColor: isExpired ? 'error.main' : 'primary.main',
											opacity: isExpired ? 0.7 : 1,
										}}
										elevation={isExpired ? 0 : 2}
									>
										<Box
											sx={{
												display: 'flex',
												flexDirection: { xs: 'column', sm: 'row' },
												justifyContent: 'space-between',
											}}
										>
											<Typography variant='subtitle1'>
												Доктор: {appointment.doctor.name}
												{isExpired && (
													<Typography
														variant='caption'
														color='error'
														sx={{ ml: 1 }}
													>
														(Время приёма прошло)
													</Typography>
												)}
											</Typography>
											<Typography variant='body2' color='text.secondary'>
												{appointment.date}
											</Typography>
										</Box>

										<Typography variant='body2'>
											Дата:{' '}
											{new Date(
												appointment.start_datetime
											).toLocaleDateString()}
										</Typography>
										<Typography variant='body2'>
											Время:{' '}
											{formatAppointmentTime(
												appointment.start_datetime,
												appointment.end_datetime
											)}
										</Typography>

										{appointment.notes && (
											<Typography variant='body2'>
												Примечание: {appointment.notes}
											</Typography>
										)}

										{!isExpired && (
											<Box
												sx={{
													display: 'flex',
													gap: 1,
													mt: 1,
													flexDirection: { xs: 'column', sm: 'row' },
												}}
											>
												<Button
													variant='contained'
													color={'primary'}
													size='small'
													fullWidth={{ xs: true, sm: false }}
													onClick={() =>
														handleStartChat(appointment?.doctor?.id)
													}
													sx={{
														minWidth: { xs: 'unset', sm: '100px' },
														whiteSpace: 'nowrap',
													}}
												>
													Открыть Чат
												</Button>
												<Button
													variant='contained'
													color={'primary'}
													size='small'
													fullWidth={{ xs: true, sm: false }}
													onClick={() => {
														setEditingAppointmentId(appointment.appointment_id)
														setAppointmentNotes(appointment.notes || '')
													}}
													sx={{
														minWidth: { xs: 'unset', sm: '100px' },
														whiteSpace: 'nowrap',
													}}
												>
													Редактировать
												</Button>
												<Button
													variant='outlined'
													color='error'
													size='small'
													fullWidth={{ xs: true, sm: false }}
													onClick={async () => {
														try {
															await deletedPatientRecord(
																appointment.appointment_id
															)
															await fetchAppointments()
														} catch (error) {
															console.error('Ошибка при отмене записи:', error)
														}
													}}
													sx={{
														minWidth: { xs: 'unset', sm: '100px' },
														whiteSpace: 'nowrap',
													}}
												>
													Отменить запись
												</Button>
											</Box>
										)}

										{editingAppointmentId === appointment.appointment_id &&
											!isExpired && (
												<Box
													sx={{
														display: 'flex',
														gap: 1,
														mt: 1,
														alignItems: 'center',
														flexDirection: { xs: 'column', sm: 'row' },
													}}
												>
													<TextField
														value={appointmentNotes}
														onChange={e => setAppointmentNotes(e.target.value)}
														size='small'
														fullWidth
													/>
													<Box
														sx={{
															display: 'flex',
															gap: 1,
															width: { xs: '100%', sm: 'auto' },
														}}
													>
														<Button
															variant='contained'
															fullWidth={{ xs: true, sm: false }}
															onClick={async () => {
																await updatePatientRecord(
																	appointment.appointment_id,
																	appointmentNotes
																)
																setEditingAppointmentId(null)
																fetchAppointments()
															}}
														>
															Сохранить
														</Button>
														<Button
															variant='text'
															fullWidth={{ xs: true, sm: false }}
															onClick={() => setEditingAppointmentId(null)}
														>
															Отмена
														</Button>
													</Box>
												</Box>
											)}
									</Paper>
								)
							})}
						</Box>
					) : (
						<Typography variant='body2' color='text.secondary'>
							У вас нет запланированных записей
						</Typography>
					)}
				</Paper>

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
						<Typography variant='h6' gutterBottom>
							🩺 Информация о пациенте:
						</Typography>

						{isEditing ? (
							<Box
								sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
							>
								<TextField
									label='Дата рождения'
									name='date_of_birth'
									value={user.date_of_birth || ''}
									onChange={handleInputChange}
									type='date'
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
									label='Пол'
									name='gender'
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
									<option value=''>Не указан</option>
									<option value='male'>Мужской</option>
									<option value='female'>Женский</option>
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
										<Typography variant='caption' color='text.secondary'>
											Дата рождения
										</Typography>
										<Typography variant='body1'>
											{user.date_of_birth || 'Не указано'}
										</Typography>
									</Box>
								</Box>

								<Box sx={{ display: 'flex', gap: 1 }}>
									<WcIcon sx={{ alignSelf: 'end', color: 'action.active' }} />
									<Box>
										<Typography variant='caption' color='text.secondary'>
											Пол
										</Typography>
										<Typography variant='body1'>
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
						<Typography variant='h6' gutterBottom>
							Информация о докторе
						</Typography>

						{isEditing ? (
							<Box
								sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
							>
								<TextField
									label='Место работы'
									name='workplace'
									value={user.workplace || ''}
									onChange={handleInputChange}
									fullWidth
									InputProps={{
										startAdornment: (
											<WorkIcon sx={{ mr: 1, color: 'action.active' }} />
										),
									}}
								/>

								<TextField
									label='Дата рождения'
									name='date_of_birth'
									value={user.date_of_birth || ''}
									onChange={handleInputChange}
									type='date'
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
									label='Пол'
									name='gender'
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
									<option value=''>Не указан</option>
									<option value='male'>Мужской</option>
									<option value='female'>Женский</option>
								</TextField>
								<TextField
									label='Биография'
									name='bio'
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
									label='Специализация'
									name='specialization'
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
									label='Опыт работы (лет)'
									name='experience'
									value={user.experience || ''}
									onChange={handleInputChange}
									fullWidth
									type='number'
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
									<WorkIcon
										sx={{ alignSelf: 'center', color: 'action.active' }}
									/>
									<Box>
										<Typography variant='caption' color='text.secondary'>
											Место работы
										</Typography>
										<Typography variant='body1'>
											{user.workplace || 'Не указано'}
										</Typography>
									</Box>
								</Box>
								ата рожден
								<Box sx={{ display: 'flex', gap: 1 }}>
									<CalendarMonthIcon
										sx={{ alignSelf: 'center', color: 'action.active' }}
									/>
									<Box>
										<Typography variant='caption' color='text.secondary'>
											Дата рождения
										</Typography>
										<Typography variant='body1'>
											{user.date_of_birth || 'Не указано'}
										</Typography>
									</Box>
								</Box>
								<Box sx={{ display: 'flex', gap: 1 }}>
									<WcIcon
										sx={{ alignSelf: 'center', color: 'action.active' }}
									/>
									<Box>
										<Typography variant='caption' color='text.secondary'>
											Пол
										</Typography>
										<Typography variant='body1'>
											{user.gender || 'Не указано'}
										</Typography>
									</Box>
								</Box>
								<Box sx={{ display: 'flex', gap: 1 }}>
									<InfoIcon
										sx={{ alignSelf: 'center', color: 'action.active' }}
									/>
									<Box>
										<Typography variant='caption' color='text.secondary'>
											Биография
										</Typography>
										<Typography variant='body1'>
											{user.bio || 'Не указано'}
										</Typography>
									</Box>
								</Box>
								<Box sx={{ display: 'flex', gap: 1 }}>
									<MedicalInformationIcon
										sx={{ alignSelf: 'center', color: 'action.active' }}
									/>
									<Box>
										<Typography variant='caption' color='text.secondary'>
											Специализация
										</Typography>
										<Typography variant='body1'>
											{user.specialization || 'Не указано'}
										</Typography>
									</Box>
								</Box>
								<Box sx={{ display: 'flex', gap: 1 }}>
									<WorkIcon
										sx={{ alignSelf: 'center', color: 'action.active' }}
									/>
									<Box>
										<Typography variant='caption' color='text.secondary'>
											Опыт работы
										</Typography>
										<Typography variant='body1'>
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
