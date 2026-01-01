'use client'

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { loginUser } from '../../../api/auth'
import { useQueryClient } from '@tanstack/react-query'
import styles from './LoginUser.module.scss'

import {
	Box,
	Paper,
	Typography,
	TextField,
	Button,
	Alert,
	InputAdornment,
	Fade,
} from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import LoginIcon from '@mui/icons-material/Login'

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
			queryClient.invalidateQueries(['user'])
			navigate('/profile') 
		},
		onError: (error: any) => {
			setErrorMessage(error.response?.data?.message || 'Ошибка входа')
		},
	})


	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

const handleLoginClick = (e: React.FormEvent<HTMLFormElement>) => {
	e.preventDefault() // Обязательно! Чтобы форма не перезагружала страницу
	setErrorMessage('')
	loginMutation.mutate()
}


	return (
		<Box
			sx={{
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				px: 2,
				background: 'linear-gradient(135deg, #f8f8f8 0%, #e8ecf3 100%)',
			}}
		>
			<Fade in timeout={500}>
				<Paper
					elevation={4}
					sx={{
						width: '100%',
						maxWidth: 400,
						p: 2,
						borderRadius: 4,
						backgroundColor: '#ffffff',
						boxShadow: '0px 10px 30px rgba(0,0,0,0.05)',
					}}
				>
					<Box sx={{ textAlign: 'center', mb: 3 }}>
						<LoginIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
						<Typography variant='h5' fontWeight='bold'>
							Добро пожаловать
						</Typography>
						<Typography variant='body2' color='text.secondary'>
							Введите данные для входа
						</Typography>
					</Box>

					<form noValidate onSubmit={handleLoginClick}>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
							<TextField
								label='Email'
								name='email'
								type='email'
								value={formData.email}
								onChange={handleInputChange}
								fullWidth
								required
								autoComplete='email'
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>
											<EmailIcon color='action' />
										</InputAdornment>
									),
								}}
							/>

							<TextField
								label='Пароль'
								name='password'
								type='password'
								value={formData.password}
								onChange={handleInputChange}
								fullWidth
								required
								autoComplete='current-password'
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>
											<LockIcon color='action' />
										</InputAdornment>
									),
								}}
							/>

							{errorMessage && (
								<Alert severity='error' variant='outlined'>
									{errorMessage}
								</Alert>
							)}

							<Button
								type='submit'
								variant='contained'
								size='large'
								fullWidth
								disabled={loginMutation.isPending}
								sx={{
									fontWeight: 'bold',
									textTransform: 'none',
									py: 1.5,
									mt: 1,
								}}
							>
								{loginMutation.isPending ? 'Вход...' : 'Войти'}
							</Button>

							<Button
								variant='text'
								onClick={() => navigate('/register')}
								fullWidth
								sx={{
									mt: 1,
									textTransform: 'none',
									fontSize: 14,
									color: 'text.secondary',
									'& strong': { color: 'primary.main' },
								}}
							>
								Нет аккаунта?{' '}
								<strong style={{ color: '#4c4cff' }}>
									&nbsp;Зарегистрироваться
								</strong>
							</Button>

							<Button
								variant='text'
								onClick={() => navigate('/company')}
								fullWidth
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
