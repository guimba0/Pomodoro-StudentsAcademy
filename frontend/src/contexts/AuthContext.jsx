import { createContext, useContext, useState, useEffect } from 'react'
import { fetchMe } from '../api/api'

const AuthContext = createContext(null)

const USER_KEY = 'pomodoro_user'
const TOKEN_KEY = 'pomodoro_token'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem(USER_KEY)
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) return

    fetchMe().then((data) => {
      if (data.logado) {
        const u = { nome: data.nome, email: data.email }
        setUser(u)
        localStorage.setItem(USER_KEY, JSON.stringify(u))
      } else if (!data.erro?.includes('conexão')) {
        setUser(null)
        localStorage.removeItem(USER_KEY)
        localStorage.removeItem(TOKEN_KEY)
      }
    })
  }, [])

  const login = (token, userData) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
    setUser(userData)
  }

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
