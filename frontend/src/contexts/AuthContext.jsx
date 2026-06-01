// 1. Contexto de autenticação — gerencia estado do usuário logado em toda a app
import { createContext, useContext, useState, useEffect } from 'react'
import { fetchMe } from '../api/api'

const AuthContext = createContext(null)

const USER_KEY = 'pomodoro_user'
const TOKEN_KEY = 'pomodoro_token'

export function AuthProvider({ children }) {
  // 2. Inicializa com dados salvos no localStorage (persistência entre reloads)
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem(USER_KEY)
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  })

  // 3. Verifica se o token ainda é válido ao montar o componente
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) return

    fetchMe().then((data) => {
      if (data.logado) {
        const u = {
          id: data.id,
          nome: data.nome,
          email: data.email,
          avatar: data.avatar ?? null,
          wallpaper: data.wallpaper ?? null,
          pontos: data.pontos ?? 0,
          tomates: data.tomates ?? 0,
        }
        setUser(u)
        localStorage.setItem(USER_KEY, JSON.stringify(u))
      } else if (!data.erro?.includes('conexão')) {
        setUser(null)
        localStorage.removeItem(USER_KEY)
        localStorage.removeItem(TOKEN_KEY)
      }
    })
  }, [])

  // 4. Login — salva token + dados e atualiza estado
  const login = (token, userData) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
    setUser(userData)
  }

  // 5. Logout — limpa storage e estado
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
