import React, { useState } from 'react'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import styles from './NotFoundPage.module.scss'

const NotFoundPage: React.FC = () => {
	const navigate = useNavigate()
	const [showSecondButton, setShowSecondButton] = useState(false) 

	const goBack = () => {
		navigate(-1)
	}

	const handleFirstButtonClick = () => {
		setShowSecondButton(true) 
	}

	return (
		<div className={styles.pageWrapper}>
			<div className={styles.errorContent}>
				<h1 className={styles.title}>404</h1>
				<p className={styles.message}>Страница не найдена</p>

				{!showSecondButton ? (
					<Button
						variant='contained'
						color='primary'
						onClick={handleFirstButtonClick}
						className={styles.backButton}
					>
						Нажми если ты черт
					</Button>
				) : (
					<Button
						variant='contained'
						color='primary'
						onClick={goBack}
						className={styles.backButton}
					>
						Ля ты краса!
					</Button>
				)}
			</div>
		</div>
	)
}

export default NotFoundPage
