import { memo } from 'react'

// 1. Rodape fixo com creditos da equipe
function Footer() {
  return (
    <footer className="footer">
      <span>Pomodoro — Árvore do Foco</span>
      <span className="footer-sep">|</span>
      <span>Guilherme · Andressa · Henry</span>
      <span className="footer-sep">|</span>
      <span>FATEC 2026</span>
    </footer>
  )
}

export default memo(Footer)
