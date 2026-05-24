import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingScreen from './components/LoadingScreen'
import Guide from './pages/Guide'
import Pomodoro from './pages/Pomodoro'
import RotaProtegida from './components/RotaProtegida'

// 1. lazy() carrega paginas sob demanda, para evitar pacote inicial grande
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const Profile = lazy(() => import('./pages/Profile'))
const Settings = lazy(() => import('./pages/Settings'))
const Ranking = lazy(() => import('./pages/Ranking')) 

// 2. Componente raiz que define layout e rotas
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
            <Route path="/perfil" element={<RotaProtegida><Profile /></RotaProtegida>} />
            <Route path="/configuracoes" element={<RotaProtegida><Settings /></RotaProtegida>} />
          
            <Route path="/guia" element={<Guide />} />
            
            <Route path="/timer" element={<Pomodoro />} />
            
            <Route path="/ranking" element={<Ranking />} />
          </Routes>
        </Suspense>
        <Footer />
      </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
