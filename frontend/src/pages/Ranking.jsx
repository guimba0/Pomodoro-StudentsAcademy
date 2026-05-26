import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import useTitle from '../hooks/useTitle'
import { fetchRanking } from '../api/api'

const periods = [
  { id: 'weekly', label: 'Semanal' },
  { id: 'monthly', label: 'Mensal' },
]

const medals = ['1st', '2nd', '3rd']

function RankingRow({ pos, entry, isMe }) {
  return (
    <div className={`ranking-row${isMe ? ' ranking-row-me' : ''}`}>
      <span className="ranking-pos">
        {pos <= 3 ? <span className="ranking-medal">{medals[pos - 1]}</span> : `#${pos}`}
      </span>
      <div className="ranking-user">
        <img className="ranking-avatar" src="/img/ProfilePhoto.png" alt="" />
        <span className="ranking-name">{entry.nome}</span>
        {isMe && <span className="ranking-badge">tu</span>}
      </div>
      <span className="ranking-stat">{entry.pontos} pts</span>
      <span className="ranking-stat ranking-apples">{entry.macas} macas</span>
    </div>
  )
}

export default function Ranking() {
  useTitle('Ranking')
  const { user } = useAuth()
  const [period, setPeriod] = useState('weekly')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchRanking(period).then(res => {
      setData(res)
      setLoading(false)
    })
  }, [period])

  return (
    <main className="ranking-page">
      <div className="ranking-card-header">
        <h1>Ranking</h1>
        <p>Os <strong>mais focados</strong> da plataforma</p>
      </div>

      <div className="ranking-card">
        <div className="ranking-tabs">
          {periods.map(p => (
            <button
              key={p.id}
              className={`ranking-tab${period === p.id ? ' active' : ''}`}
              onClick={() => setPeriod(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="ranking-list">
          {loading ? (
            <p className="ranking-loader">A carregar...</p>
          ) : data && data.length > 0 ? (
            data.map((entry, i) => (
              <RankingRow
                key={entry.id ?? i}
                pos={i + 1}
                entry={entry}
                isMe={user && entry.email === user.email}
              />
            ))
          ) : (
            <p className="ranking-empty">Nenhum dado disponivel ainda.</p>
          )}
        </div>
      </div>
    </main>
  )
}
