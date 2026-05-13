import { createContext, useContext, useState, useEffect } from 'react'
import { fetchMe } from '../api/api'

const AuthContext = createContext(null)

const CACHE_KEY = 'pomodoro_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY)
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    fetchMe().then((data) => {
      if (data.logado) {
        const u = { nome: data.nome, email: data.email }
        setUser(u)
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(u))
      } else if (!data.erro?.includes('conexão')) {
        setUser(null)
        sessionStorage.removeItem(CACHE_KEY)
      }
    })
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
