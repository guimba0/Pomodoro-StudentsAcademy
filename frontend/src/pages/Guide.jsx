import { useState } from 'react'
import { Link } from 'react-router-dom'

// 1. Dados estaticos dos topicos do guia
const topics = [
  {
    id: 'timer',
    heading: 'O Timer',
    content: (
      <>
        <p>
          O método Pomodoro clássico divide seu tempo em blocos:<br />
          <strong>25 minutos</strong> de foco total &rarr; <strong>5 minutos</strong> de pausa curta &rarr; <strong>15 minutos</strong> de pausa longa (após 4 ciclos).
        </p>
        <p className="mt-2">
          O próximo ciclo nunca inicia sozinho — você decide quando começar.
        </p>
        <div className="guide-example">
          <strong>momomomo:</strong> 25min foco → 5min pausa → repita 4x → 15min pausa longa
        </div>
      </>
    )
  },
  {
    id: 'arvore',
    heading: 'A Árvore do Foco',
    content: (
      <>
        <p>
          Cada sessão de foco cultiva sua <strong>árvore virtual</strong>. Ela começa como <strong>semente</strong>, vira <strong>muda</strong> e se torna uma <strong>árvore</strong> conforme você completa ciclos.
        </p>
        <p className="mt-2">
          <strong>Atenção:</strong> se você fechar a página durante o foco e não voltar em até <strong>120 segundos</strong>, a árvore morre e a sessão é perdida.
        </p>
        <div className="guide-example">
          <strong>momomomo:</strong> semente (1 ciclo) → muda (5 ciclos) → árvore (20 ciclos)
        </div>
      </>
    )
  },
  {
    id: 'pontos',
    heading: 'Pontos e Maçãs',
    content: (
      <>
        <p>
          Enquanto você foca, acumula <strong>pontos</strong> por minuto válido. Ao concluir um ciclo, ganha um <strong>bônus</strong> extra.
        </p>
        <p className="mt-2">
          A cada <strong>5 minutos</strong> de foco, você recebe 1 <strong>tomate</strong> (moeda do sistema). Pausas não geram recompensas.
        </p>
        <div className="guide-example">
          <strong>momomomo:</strong> 25min foco = 25 pontos + 5 tomate + bônus por conclusão
        </div>
      </>
    )
  },
  {
    id: 'ranking',
    heading: 'Ranking',
    content: (
      <>
        <p>
          Seus pontos são comparados com outros usuários no <strong>ranking global</strong>. Organizado por semana e mês, ele mostra quem está mais dedicado.
        </p>
        <div className="guide-example">
          <strong>momomomo:</strong> ranking semanal: 1º lugar com 500 pontos
        </div>
      </>
    )
  },
  {
    id: 'visitante',
    heading: 'Visitante vs Logado',
    content: (
      <>
        <p>
          <strong>Visitante:</strong> usa o timer normalmente, mas sem salvar progresso, sem árvore, sem pontos.<br />
          <strong>Logado:</strong> tudo é persistido — árvore, pontos, tomate e ranking.
        </p>
        <p className="mt-2">
          Faça <Link to="/cadastro">cadastro</Link> ou{' '}
          <Link to="/login">login</Link> para aproveitar ao máximo.
        </p>
        <div className="guide-example">
          <strong>momomomo:</strong> visitante = sem progresso | logado = tudo salvo
        </div>
      </>
    )
  }
]

import useTitle from '../hooks/useTitle'

// 2. Pagina do guia interativo com abas laterais
export default function Guide() {
  useTitle('Guia')
  const [active, setActive] = useState(topics[0].id)

  const current = topics.find(t => t.id === active)

  return (
    <main className="guide-page">
      <div className="guide-card-header">
        <h1>Guia do Pomodoro</h1>
        <p>Entenda como funciona o <strong>Árvore do Foco</strong></p>
      </div>

      <div className="guide-card">
        <div className="guide-card-body">
          <aside className="guide-sidebar">
            {topics.map(t => (
              <button
                key={t.id}
                className={`guide-block${active === t.id ? ' active' : ''}`}
                onClick={() => setActive(t.id)}
              >
                {t.heading}
              </button>
            ))}
          </aside>

          <section className="guide-content">
            {current && (
              <div className="guide-body">
                <h2>{current.heading}</h2>
                {current.content}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
