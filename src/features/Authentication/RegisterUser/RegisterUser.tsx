
import React, { useState } from 'react'
import {
	Box,
	Paper,
	Typography,
	TextField,
	Button,
	Alert,
	FormControlLabel,
	Checkbox,
	FormControl,
	FormLabel,
	RadioGroup,
	Radio,
	InputAdornment,
	Fade,
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import HowToRegIcon from '@mui/icons-material/HowToReg'

import * as yup from 'yup'
import styles from './RegisterUser.module.scss'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { registerUser, loginUser } from '../../../api/auth'
import { useQueryClient } from '@tanstack/react-query'

// Интерфейс данных формы
interface FormData {
	email: string
	last_name: string
	first_name: string
	middle_name?: string
	role: number // 0 - Пациент, 1 - Доктор
	password: string
	password_confirmation: string
}

// Функция для конвертации строки в числовое значение
const mapRoleToNumber = (role: string) => (role === 'Doctor' ? 1 : 0)

// Валидационная схема Yup
const validationSchema = yup.object().shape({
	first_name: yup.string().required('Имя обязательно'),
	last_name: yup.string().required('Фамилия обязательна'),
	middle_name: yup.string(),
	email: yup.string().email('Некорректный email').required('Email обязателен'),
	password: yup
		.string()
		.min(6, 'Пароль должен содержать минимум 6 символов')
		.required('Пароль обязателен'),
	password_confirmation: yup
		.string()
		.oneOf([yup.ref('password')], 'Пароли не совпадают')
		.required('Подтверждение пароля обязательно'),
	role: yup
		.number()
		.oneOf([0, 1], 'Выберите роль')
		.required('Роль обязательна'),
})

export default function RegisterUser() {
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const [formData, setFormData] = useState<FormData>({
		first_name: '',
		last_name: '',
		middle_name: '',
		email: '',
		password: '',
		password_confirmation: '',
		role: 0, // По умолчанию пациент
	})

	const [hasMiddleName, setHasMiddleName] = useState(false)
	const [errors, setErrors] = useState<Partial<FormData>>({})
	const [successMessage, setSuccessMessage] = useState('')
	const [errorMessage, setErrorMessage] = useState('')

	// Функции для обработки запросов через React Query
	const registerMutation = useMutation({
		mutationFn: async () => {
			return registerUser(formData)
		},

		onSuccess: async () => {
			// После успешной регистрации запускаем логин
			const loginResponse = await loginMutation.mutateAsync({
				email: formData.email,
				password: formData.password,
			})


			queryClient.invalidateQueries(['user'])

			setSuccessMessage('Регистрация и вход выполнены успешно!')
			navigate('/profile')
		},
		onError: (error: any) => {
			setErrorMessage(error.response?.data?.message || 'Ошибка регистрации')
		},
	})

	const loginMutation = useMutation({
		mutationFn: async (credentials: { email: string; password: string }) => {
			return loginUser(credentials)
		},
		onError: () => {
			setErrorMessage('Ошибка при входе. Проверьте email и пароль.')
		},
	})

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const numericRole = Number(e.target.value) // Преобразуем в число
		setFormData(prev => ({ ...prev, role: numericRole }))
	}

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setHasMiddleName(e.target.checked)
		if (!e.target.checked) {
			setFormData(prev => ({ ...prev, middle_name: '' }))
		}
	}

	const validateForm = async (): Promise<boolean> => {
		try {
			await validationSchema.validate(formData, { abortEarly: false })
			setErrors({})
			return true
		} catch (validationError) {
			const newErrors: Partial<FormData> = {}
			if (validationError instanceof yup.ValidationError) {
				validationError.inner.forEach(error => {
					if (error.path) {
						newErrors[error.path as keyof FormData] = error.message
					}
				})
			}
			setErrors(newErrors)
			return false
		}
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setSuccessMessage('')
		setErrorMessage('')

		const isValid = await validateForm()
		if (!isValid) return

		registerMutation.mutate()
	}

	return (
		<Box
			sx={{
				minHeight: '100vh',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				px: 2,
				background: 'linear-gradient(135deg, #f8f8f8 0%, #e0eafc 100%)',
			}}
		>
			<Fade in timeout={500}>
				<Paper
					elevation={4}
					sx={{
						width: '100%',
						maxWidth: 420,
						p: 2,
						borderRadius: 4,
						backgroundColor: 'white',
						boxShadow: '0px 10px 25px rgba(0,0,0,0.05)',
					}}
				>
					<Box sx={{ textAlign: 'center', mb: 3 }}>
						<HowToRegIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
						<Typography variant="h5" fontWeight="bold">
							Регистрация
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Заполните форму ниже
						</Typography>
					</Box>

					<form onSubmit={handleSubmit} noValidate>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
							<TextField
								label="Имя"
								name="first_name"
								value={formData.first_name}
								onChange={handleInputChange}
								error={!!errors.first_name}
								helperText={errors.first_name}
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
								value={formData.last_name}
								onChange={handleInputChange}
								error={!!errors.last_name}
								helperText={errors.last_name}
								fullWidth
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<PersonIcon color="action" />
										</InputAdornment>
									),
								}}
							/>

							{hasMiddleName && (
								<TextField
									label="Отчество"
									name="middle_name"
									value={formData.middle_name}
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
							)}

							<FormControlLabel
								control={
									<Checkbox
										checked={hasMiddleName}
										onChange={handleCheckboxChange}
										color="primary"
									/>
								}
								label="Добавить отчество (при наличии)"
								sx={{ ml: '-8px' }}
							/>

							<FormControl>
								<FormLabel component="legend">Роль</FormLabel>
								<RadioGroup
									row
									name="role"
									value={formData.role.toString()}
									onChange={handleRoleChange}
								>
									<FormControlLabel
										value="0"
										control={<Radio />}
										label="Пациент"
									/>
									{/* <FormControlLabel
										value="1"
										control={<Radio />}
										label="Доктор"
									/> */}
								</RadioGroup>
								{errors.role && (
									<Typography variant="caption" color="error">
										{errors.role}
									</Typography>
								)}
							</FormControl>

							<TextField
								label="Email"
								name="email"
								type="email"
								value={formData.email}
								onChange={handleInputChange}
								error={!!errors.email}
								helperText={errors.email}
								fullWidth
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<EmailIcon color="action" />
										</InputAdornment>
									),
								}}
							/>

							<TextField
								label="Пароль"
								name="password"
								type="password"
								value={formData.password}
								onChange={handleInputChange}
								error={!!errors.password}
								helperText={errors.password}
								fullWidth
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<LockIcon color="action" />
										</InputAdornment>
									),
								}}
							/>

							<TextField
								label="Подтверждение пароля"
								name="password_confirmation"
								type="password"
								value={formData.password_confirmation}
								onChange={handleInputChange}
								error={!!errors.password_confirmation}
								helperText={errors.password_confirmation}
								fullWidth
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<LockIcon color="action" />
										</InputAdornment>
									),
								}}
							/>

							{successMessage && (
								<Alert severity="success">{successMessage}</Alert>
							)}
							{errorMessage && <Alert severity="error">{errorMessage}</Alert>}

							<Button
								type="submit"
								variant="contained"
								fullWidth
								size="large"
								disabled={registerMutation.isPending}
								sx={{
									fontWeight: 'bold',
									textTransform: 'none',
									py: 1.5,
									mt: 1,
								}}
							>
								{registerMutation.isPending
									? 'Регистрация...'
									: 'Зарегистрироваться'}
							</Button>

							<Button
								variant="text"
								fullWidth
								color="info"
								onClick={() => navigate('/login')}
								sx={{
									textTransform: 'none',
									fontSize: 14,
									color: 'text.secondary',
									'& strong': { color: 'primary.main' },
								}}
							>
								Уже есть аккаунт?{' '}
								<strong style={{ color: '#4c4cff' }}>&nbsp;Войти</strong>
							</Button>

							<Button
								variant="text"
								fullWidth
								onClick={() => navigate('/company')}
								sx={{
									textTransform: 'none',
									fontSize: 14,
									color: 'text.secondary',
								}}
							>
								О компании
							</Button>
						</Box>
					</form>
				</Paper>
			</Fade>
		</Box>
	)
}
