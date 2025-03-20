
import React, { useState } from 'react'
import {
	TextField,
	Checkbox,
	FormControlLabel,
	Button,
	Alert,
	RadioGroup,
	FormControl,
	FormLabel,
	Radio,
} from '@mui/material'
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

			localStorage.setItem('token', loginResponse.token)
			queryClient.invalidateQueries(['user'])

			setSuccessMessage('Регистрация и вход выполнены успешно!')
			navigate('/user/profile')
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
		<div className={styles.loginFormWrapper}>
			<div className={styles.loginForm}>
				<h2>Регистрация</h2>

				<form onSubmit={handleSubmit} className={styles.formContainer}>
					<TextField
						label='Имя'
						variant='outlined'
						fullWidth
						name='first_name'
						value={formData.first_name}
						onChange={handleInputChange}
						error={!!errors.first_name}
						helperText={errors.first_name}
					/>

					<TextField
						label='Фамилия'
						variant='outlined'
						fullWidth
						name='last_name'
						value={formData.last_name}
						onChange={handleInputChange}
						error={!!errors.last_name}
						helperText={errors.last_name}
					/>

					{hasMiddleName && (
						<TextField
							label='Отчество'
							variant='outlined'
							fullWidth
							name='middle_name'
							value={formData.middle_name}
							onChange={handleInputChange}
						/>
					)}

					<FormControlLabel
						control={
							<Checkbox
								checked={hasMiddleName}
								onChange={handleCheckboxChange}
								color='primary'
							/>
						}
						label='Добавить отчество (при наличии)'
					/>

					<FormControl component='fieldset'>
						<FormLabel component='legend'>Роль</FormLabel>
						<RadioGroup
							row
							name='role'
							value={formData.role.toString()}
							onChange={handleRoleChange}
						>
							<FormControlLabel value='0' control={<Radio />} label='Пациент' />
							<FormControlLabel value='1' control={<Radio />} label='Доктор' />
						</RadioGroup>
						{errors.role && (
							<span style={{ color: 'red', fontSize: '12px' }}>
								{errors.role}
							</span>
						)}
					</FormControl>

					<TextField
						label='Email'
						variant='outlined'
						fullWidth
						name='email'
						value={formData.email}
						onChange={handleInputChange}
						error={!!errors.email}
						helperText={errors.email}
					/>

					<TextField
						label='Пароль'
						variant='outlined'
						fullWidth
						name='password'
						type='password'
						value={formData.password}
						onChange={handleInputChange}
						error={!!errors.password}
						helperText={errors.password}
					/>

					<TextField
						label='Подтверждение пароля'
						variant='outlined'
						fullWidth
						name='password_confirmation'
						type='password'
						value={formData.password_confirmation}
						onChange={handleInputChange}
						error={!!errors.password_confirmation}
						helperText={errors.password_confirmation}
					/>

					<Button
						type='submit'
						variant='outlined'
						color='error'
						fullWidth
						size='large'
						disabled={registerMutation.isPending}
					>
						<strong>
							{registerMutation.isPending
								? 'Регистрация...'
								: 'Зарегистрироваться'}
						</strong>
					</Button>

					{successMessage && <Alert severity='success'>{successMessage}</Alert>}
					{errorMessage && <Alert severity='error'>{errorMessage}</Alert>}
					<Button
						size='medium'
						onClick={() => navigate('/login')}
						variant='text'
						fullWidth
						color='info'
					>
						Уже есть аккаунт? <strong>&nbsp;Войти</strong>
					</Button>
				</form>
			</div>
		</div>
	)
}
