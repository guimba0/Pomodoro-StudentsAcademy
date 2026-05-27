import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import useTitle from '../hooks/useTitle'
import { fetchRanking } from '../api/api'
import TomatoIcon from '../components/TomatoIcon'

const medals = ['🥇', '🥈', '🥉']

function RankingRow({ pos, entry, isMe }) {
  return (
    <div className={`ranking-row${isMe ? ' ranking-row-me' : ''}`}>
      <span className="ranking-pos">
        {pos <= 3 ? <span className="ranking-medal">{medals[pos - 1]}</span> : `#${pos}`}
      </span>
      <div className="ranking-user">
        <TomatoIcon className="ranking-avatar" />
        <span className="ranking-name">{entry.nome}</span>
        {isMe && <span className="ranking-badge">tu</span>}
      </div>
      <div className="ranking-stats">
        <span className="ranking-stat ranking-stat-ciclos" title="Ciclos Completos">
          ✅ {entry.completos} ciclos
        </span>
        <span className="ranking-stat" title="Pontos">{entry.pontos} pts</span>
        <span className="ranking-stat ranking-stat-tomates" title="Tomates">
          🍅 {entry.tomates}
        </span>
      </div>
    </div>
  )
}

export default function Ranking() {
  useTitle('Ranking')
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchRanking().then(res => {
      if (res && Array.isArray(res)) {
        setData(res)
      } else {
        setData([])
      }
      setLoading(false)
    })
  }, [])

  return (
    <main className="ranking-page">
      <div className="ranking-card-header">
        <h1>🏆 Ranking</h1>
        <p>Os <strong>mais focados</strong> da plataforma</p>
      </div>

      <div className="ranking-card">
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
