import useTitle from '../hooks/useTitle'

// 1. Pagina do timer Pomodoro (em construcao)
export default function Pomodoro() {
  useTitle('Timer')
  return (
    <main className="pomodoro-page">
      <h1 className="pomodoro-title">Timer Pomodoro</h1>
      <p className="pomodoro-subtitle">Em breve...</p>
    </main>
  )
}
