// src/AppInitializer.tsx
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getToken } from '../utils/jwt'
import { fetchCurrentUser } from '../api/profile'
import { setUser } from '../features/Authentication/authSlice'

const AppInitializer = ({ children }) => {
	const dispatch = useDispatch()
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const init = async () => {
			const token = getToken()
			
			// Не делаем API запрос на публичных страницах
			const publicPaths = ['/login', '/signup', '/register', '/registerDoctor']
			const isPublicPath = publicPaths.includes(window.location.pathname)
			
			if (token && !isPublicPath) {
				try {
					const user = await fetchCurrentUser()
					dispatch(setUser({ user, token }))
				} catch (error) {
					console.warn('Token is invalid or user not found')
				}
			}
			setLoading(false)
		}
		init()
	}, [])

	if (loading) return <div>Загрузка...</div>

	return children
}

export default AppInitializer
