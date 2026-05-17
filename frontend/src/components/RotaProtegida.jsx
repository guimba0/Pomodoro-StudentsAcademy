import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// 1. So permite acesso ao conteudo se o usuario estiver logado
export default function RotaProtegida({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}
