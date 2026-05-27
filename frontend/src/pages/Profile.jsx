import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { apiFetch } from '../api/api'
import useTitle from '../hooks/useTitle'
import TomatoIcon from '../components/TomatoIcon'

export default function Profile() {
  useTitle('Perfil')
  const { user } = useAuth()
  const [progresso, setProgresso] = useState(null)

  useEffect(() => {
    apiFetch('/pomodoro/progresso').then(data => {
      if (data && !data.erro) setProgresso(data)
    })
  }, [])

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="perfil-header">
          <TomatoIcon className="perfil-avatar" />
          <h1 className="perfil-nome">{user?.nome}</h1>
          <p className="perfil-email">{user?.email}</p>
        </div>

        <div className="perfil-stats">
          <div className="perfil-stat">
            <p className="perfil-stat-num">{progresso?.focosCompletos ?? 0}</p>
            <p className="perfil-stat-label">Focos Completos</p>
          </div>
          <div className="perfil-stat">
            <p className="perfil-stat-num">{progresso?.pontos ?? 0}</p>
            <p className="perfil-stat-label">Pontos</p>
          </div>
          <div className="perfil-stat">
            <p className="perfil-stat-num">{progresso?.tomates ?? 0}</p>
            <p className="perfil-stat-label">🍅 Tomates</p>
          </div>
          <div className="perfil-stat">
            <p className="perfil-stat-num">{progresso?.arvoreEstagio === 'TREE' ? '🌳' : progresso?.arvoreEstagio === 'SEEDLING' ? '🌿' : '🌱'}</p>
            <p className="perfil-stat-label">Árvore</p>
          </div>
        </div>
      </div>
    </main>
  )
}
