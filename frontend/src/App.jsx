import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingScreen from './components/LoadingScreen'
import RotaProtegida from './components/RotaProtegida'

const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const Profile = lazy(() => import('./pages/Profile'))
const Settings = lazy(() => import('./pages/Settings'))
const Guide = lazy(() => import('./pages/Guide'))
const Pomodoro = lazy(() => import('./pages/Pomodoro'))
const Ranking = lazy(() => import('./pages/Ranking'))

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Navbar />
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Register />} />
              <Route path="/esqueci-senha" element={<ForgotPassword />} />
              <Route path="/guia" element={<Guide />} />
              <Route path="/pomodoro" element={<RotaProtegida><Pomodoro /></RotaProtegida>} />
              <Route path="/ranking" element={<RotaProtegida><Ranking /></RotaProtegida>} />
              <Route path="/perfil" element={<RotaProtegida><Profile /></RotaProtegida>} />
              <Route path="/configuracoes" element={<RotaProtegida><Settings /></RotaProtegida>} />
            </Routes>
          </Suspense>
          <Footer />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}