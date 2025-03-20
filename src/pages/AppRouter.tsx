import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import About from './About/About'
import RegisterUser from '../features/Authentication/RegisterUser/RegisterUser'
import BottomNav from '../components/BottomNav/BottomNav'
import UserProfile from '../features/Profile/UserProfile/UserProfile'
import HomePages from './Home/Home'
import NotFoundPage from './NotFoundPage/NotFoundPage'
import LoginUser from '../features/Authentication/LoginUser/LoginUser'
import ProtectedRoute from './ProtectedRoute'
import PatientAppointmentScheduler from '../components/PatientAppointmentScheduler/PatientAppointmentScheduler'
import DoctorsList from '../components/DoctorsList/DoctorsList'
import DoctorDetails from '../components/DoctorDetails/DoctorDetails'


const AppRouter = () => (
	<Router>
		<div style={{ marginBottom: '56px' }}>
			<Routes>
				{/* Открытые маршруты */}
				<Route path='/register' element={<RegisterUser />} />
				<Route path='/login' element={<LoginUser />} />
				<Route path='/' element={<HomePages />} />

				{/* Защищённые маршруты (видны только после авторизации) */}
				<Route element={<ProtectedRoute />}>
					<Route path='/about' element={<About />} />
					<Route path='/profile' element={<UserProfile />} />
					{/* Новый маршрут для записи к врачу */}

					{/* <Route
						path='/doctors/:id'
						element={<PatientAppointmentScheduler />}
					/> */}

					<Route path='/doctors' element={<DoctorsList />} />
					<Route path='/doctors/:id' element={<DoctorDetails />} />
				</Route>

				{/* Страница 404 */}
				<Route path='*' element={<NotFoundPage />} />
			</Routes>
		</div>
		<BottomNav />
	</Router>
)

export default AppRouter
