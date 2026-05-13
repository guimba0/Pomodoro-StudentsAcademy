import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingScreen from './components/LoadingScreen'

const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const Profile = lazy(() => import('./pages/Profile'))
const Settings = lazy(() => import('./pages/Settings'))
const Guide = lazy(() => import('./pages/Guide'))
const Pomodoro = lazy(() => import('./pages/Pomodoro'))

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Register />} />
            <Route path="/esqueci-senha" element={<ForgotPassword />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/configuracoes" element={<Settings />} />
            <Route path="/guia" element={<Guide />} />
            <Route path="/pomodoro" element={<Pomodoro />} />
          </Routes>
        </Suspense>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  )
}
