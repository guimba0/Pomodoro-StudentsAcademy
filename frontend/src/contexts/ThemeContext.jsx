import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

const TEMAS = ['normal', 'light', 'dark']
const STORAGE_KEY = 'pomodoro_theme'

// 1. Provider que gerencia o tema e persiste no localStorage
export function ThemeProvider({ children }) {
  const [tema, setTema] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || 'normal'
  })

  // 2. Sincroniza o atributo data-theme no <html> sempre que o tema mudar
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema)
    localStorage.setItem(STORAGE_KEY, tema)
  }, [tema])

  return (
    <ThemeContext.Provider value={{ tema, setTema, TEMAS }}>
      {children}
    </ThemeContext.Provider>
  )
}

// 3. Hook para qualquer componente acessar o tema
export function useTheme() {
  return useContext(ThemeContext)
}
