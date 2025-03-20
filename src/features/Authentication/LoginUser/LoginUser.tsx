'use client'

import React, { useState } from 'react'
import { TextField, Button, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { loginUser } from '../../../api/auth'
import { useQueryClient } from '@tanstack/react-query'
import styles from './LoginUser.module.scss'

export default function LoginUser() {
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const [formData, setFormData] = useState({
		email: '',
		password: '',
	})
	const [errorMessage, setErrorMessage] = useState('')

	const loginMutation = useMutation({
		mutationFn: async () => loginUser(formData),
		onSuccess: data => {
			localStorage.setItem('token', data.token) // Сохраняем токен
			queryClient.invalidateQueries(['user']) // Обновляем кэш юзера
			navigate('/profile') // Редирект на профиль
		},
		onError: (error: any) => {
			setErrorMessage(error.response?.data?.message || 'Ошибка входа')
		},
	})

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setErrorMessage('')
		loginMutation.mutate()
	}

	return (
		<div className={styles.loginFormWrapper}>
			<div className={styles.loginForm}>
				<h2>Вход</h2>
				<form onSubmit={handleSubmit} className={styles.formContainer}>
					<TextField
						label='Email'
						variant='outlined'
						fullWidth
						name='email'
						value={formData.email}
						onChange={handleInputChange}
					/>
					<TextField
						label='Пароль'
						variant='outlined'
						fullWidth
						name='password'
						type='password'
						value={formData.password}
						onChange={handleInputChange}
					/>

					<Button
						type='submit'
						variant='outlined'
						color='error'
						fullWidth
						size='large'
						disabled={loginMutation.isPending}
					>
						<strong>{loginMutation.isPending ? 'Вход...' : 'Войти'}</strong>
					</Button>

					{errorMessage && <Alert severity='error'>{errorMessage}</Alert>}

					<Button
						size='medium'
						onClick={() => navigate('/register')}
						variant='text'
						fullWidth
						color='info'
					>
						Нет аккаунта?<strong>&nbsp;Зарегистрироваться</strong>
					</Button>
				</form>
			</div>
		</div>
	)
}
