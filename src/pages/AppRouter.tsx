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
import DoctorSchedule from '../components/WorkSchedulePicker/DoctorSchedule'
import Chats from './Chats/Chats'
import Chat from './Chat/Chat'
import RegisterDoctor from '../features/Authentication/RegisterDoctor/RegisterDoctor'



const AppRouter = () => (
	<Router>
		<div style={{ maxWidth: 600, padding: '0px 8px', margin: '0 auto 65px' }}>
			<Routes>
				{/* Открытые маршруты */}
				<Route path='/register' element={<RegisterUser />} />
				<Route path='/registerDoctor' element={<RegisterDoctor />} />
				<Route path='/login' element={<LoginUser />} />

				<Route path='/' element={<HomePages />} />

				{/* Защищённые маршруты (видны только после авторизации) */}
				<Route element={<ProtectedRoute />}>
					<Route path='/about' element={<About />} />
					<Route path='/profile' element={<UserProfile />} />
					<Route path='/' element={<DoctorsList />} />
					<Route path='/calendar' element={<DoctorSchedule />} />
					<Route path='/doctors' element={<DoctorsList />} />
					<Route path='/doctors/:id' element={<DoctorDetails />} />

					<Route path='/chats' element={<Chats />} />
					<Route path='/chats/:id' element={<Chat />} />
					{/* Новый маршрут для записи к врачу */}

					{/* <Route
						path='/doctors/:id'	
						element={<PatientAppointmentScheduler />}
					/> */}
					{/* <Route path="/doctors" element={<DoctorsList />} /> */}
					{/* <Route path='/doctors/:id' element={<DoctorDetails />} /> */}
				</Route>

				{/* Страница 404 */}
				<Route path='*' element={<NotFoundPage />} />
			</Routes>
		</div>
		<BottomNav />
	</Router>
)

export default AppRouter
