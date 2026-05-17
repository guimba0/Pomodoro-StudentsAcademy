import { useAuth } from '../contexts/AuthContext'

import useTitle from '../hooks/useTitle'

// 1. Pagina de perfil do usuario logado
export default function Profile() {
  useTitle('Perfil')
  const { user } = useAuth()

  // 2. Exibe avatar, nome, email e estatisticas (placeholder)
  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="perfil-header">
          <img className="perfil-avatar" src="/img/ProfilePhoto.png" alt="" />
          <h1 className="perfil-nome">{user.nome}</h1>
          <p className="perfil-email">{user.email}</p>
        </div>

        <div className="perfil-stats">
          <div className="perfil-stat">
            <p className="perfil-stat-num">0</p>
            <p className="perfil-stat-label">Ciclos Completos</p>
          </div>
          <div className="perfil-stat">
            <p className="perfil-stat-num">0</p>
            <p className="perfil-stat-label">Pontos</p>
          </div>
          <div className="perfil-stat">
            <p className="perfil-stat-num">0</p>
            <p className="perfil-stat-label">Maçãs</p>
          </div>
          <div className="perfil-stat">
            <p className="perfil-stat-num">0</p>
            <p className="perfil-stat-label">Árvores</p>
          </div>
        </div>
      </div>
    </main>
  )
}
