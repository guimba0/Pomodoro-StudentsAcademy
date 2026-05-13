import { Link } from 'react-router-dom'

import useTitle from '../hooks/useTitle'

export default function Home() {
  useTitle('Início')
  return (
    <main className="hero">
      <div className="hero-text">
        <h1 className="hero-title">Pomodoro</h1>
        <p className="hero-tagline">Foque. Descanse. Conquiste.</p>
        <p className="hero-description">
          Utilize a técnica Pomodoro de um jeito novo. Monitore seu progresso, organize sua rotina e veja sua dedicação ganhar forma.
        </p>
        <div className="hero-rules">
          <h3>A Regra é Simples:</h3>
          <p>
            Cada árvore no seu perfil representa 3 ciclos de foco total. Quanto mais você estuda, mais pontos ganha e mais alto chega no nosso ranking de produtividade.
          </p>
        </div>
      </div>
      <div className="hero-visual">
        <img className="hero-tomato" src="/img/tomate.webp" alt="Tomate Pomodoro" />
        <Link to="/pomodoro" className="hero-btn">Comece agora!</Link>
      </div>
    </main>
  )
}
