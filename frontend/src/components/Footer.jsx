import { memo } from 'react'

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
