import { useEffect } from 'react'

// Muda o titulo da aba pra "NomeDaPagina | Pomodoro"
export default function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Pomodoro` : 'Pomodoro'
  }, [title])
}
