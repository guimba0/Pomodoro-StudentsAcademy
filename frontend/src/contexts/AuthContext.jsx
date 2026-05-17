import { createContext, useContext, useState, useEffect } from 'react'
import { fetchMe } from '../api/api'

const AuthContext = createContext(null)

const CACHE_KEY = 'pomodoro_user'

// 1. Provider que envolve toda a app e gerencia o estado do usuario logado
export function AuthProvider({ children }) {
  // 2. Inicializa user com dados do sessionStorage (cache instantaneo)
  const [user, setUser] = useState(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY)
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  })

  // 3. No montagem, busca dados atualizados do servidor em background
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

  // 4. Disponibiliza user e setUser para toda a arvore de componentes
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

// 5. Hook para qualquer componente acessar o contexto de autenticacao
export function useAuth() {
  return useContext(AuthContext)
}
