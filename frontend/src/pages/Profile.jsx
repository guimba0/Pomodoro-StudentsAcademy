import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { apiFetch } from '../api/api'
import useTitle from '../hooks/useTitle'
import TomatoIcon from '../components/TomatoIcon'

export default function Profile() {
  useTitle('Perfil')

  const { user } = useAuth()

  const [progresso, setProgresso] = useState(null)

  const ofensiva = 7

  const dias = [
    { letra: 'S', ativo: true },
    { letra: 'T', ativo: true },
    { letra: 'Q', ativo: true },
    { letra: 'Q', ativo: true },
    { letra: 'S', ativo: true },
    { letra: 'S', ativo: false },
    { letra: 'D', ativo: false },
  ]

  useEffect(() => {
    apiFetch('/pomodoro/progresso').then(data => {
      if (data && !data.erro) {
        setProgresso(data)
      }
    })
  }, [])

  return (
    <>
      <style>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.08);
          }

          100% {
            transform: scale(1);
          }
        }

        @keyframes fogo {
          0% {
            transform: scaleY(1) scaleX(1) rotate(-1deg);
          }

          25% {
            transform: scaleY(1.15) scaleX(0.92) rotate(2deg);
          }

          50% {
            transform: scaleY(0.92) scaleX(1.08) rotate(-2deg);
          }

          75% {
            transform: scaleY(1.1) scaleX(0.95) rotate(1deg);
          }

          100% {
            transform: scaleY(1) scaleX(1) rotate(-1deg);
          }
        }
      `}</style>

      <main className="auth-page">
        <div className="auth-card">

          <div className="perfil-header">
            <TomatoIcon className="perfil-avatar" />

            <h1 className="perfil-nome">
              {user?.nome}
            </h1>

            <p className="perfil-email">
              {user?.email}
            </p>
          </div>

          <div style={{
            width: '100%',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '20px',
            padding: '22px',
            marginBottom: '24px'
          }}>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '20px'
            }}>

              <div style={{
                fontSize: '3.2rem',
                animation: 'pulse 1.6s infinite'
              }}>
                🔥
              </div>

              <div>
                <p style={{
                  margin: 0,
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: 'var(--color-text)'
                }}>
                  {ofensiva}
                </p>

                <p style={{
                  margin: 0,
                  color: 'var(--color-text-muted)'
                }}>
                  dias seguidos
                </p>
              </div>

            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>

              {dias.map((dia, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >

                  <div style={{
                    width: '28px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>

                    {dia.ativo ? (
                      <div style={{
                        position: 'relative',
                        width: '20px',
                        height: '28px',
                        animation: 'fogo 1s infinite ease-in-out'
                      }}>

                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: '50%',
                          transform: 'translateX(-50%) rotate(45deg)',
                          width: '18px',
                          height: '18px',
                          background: 'linear-gradient(to top, #ff5a00, #ff9500)',
                          borderRadius: '0 50% 50% 50%',
                          boxShadow: `
                            0 0 10px #ff6b00,
                            0 0 20px #ff8c00,
                            0 0 35px rgba(255,120,0,0.8)
                          `
                        }} />

                        <div style={{
                          position: 'absolute',
                          bottom: '4px',
                          left: '50%',
                          transform: 'translateX(-50%) rotate(45deg)',
                          width: '10px',
                          height: '10px',
                          background: '#ffd166',
                          borderRadius: '0 50% 50% 50%'
                        }} />

                      </div>
                    ) : (
                      <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: 'var(--color-text-muted)',
                        opacity: 0.25
                      }} />
                    )}

                  </div>

                  <span style={{
                    color: 'var(--color-text-muted)',
                    fontSize: '0.72rem',
                    fontWeight: '600'
                  }}>
                    {dia.letra}
                  </span>

                </div>
              ))}

            </div>

          </div>

          <div className="perfil-stats">

            <div className="perfil-stat">
              <p className="perfil-stat-num">
                {progresso?.focosCompletos ?? 0}
              </p>

              <p className="perfil-stat-label">
                Focos Completos
              </p>
            </div>

            <div className="perfil-stat">
              <p className="perfil-stat-num">
                {progresso?.pontos ?? 0}
              </p>

              <p className="perfil-stat-label">
                Pontos
              </p>
            </div>

            <div className="perfil-stat">
              <p className="perfil-stat-num">
                {progresso?.tomates ?? 0}
              </p>

              <p className="perfil-stat-label">
                🍅 Tomates
              </p>
            </div>

            <div className="perfil-stat">
              <p className="perfil-stat-num">
                {progresso?.arvoreEstagio === 'TREE'
                  ? '🌳'
                  : progresso?.arvoreEstagio === 'SEEDLING'
                  ? '🌿'
                  : '🌱'}
              </p>

              <p className="perfil-stat-label">
                Árvore
              </p>
            </div>

          <div
            className="perfil-stat"
            style={{
              gridColumn: '1 / -1',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <p className="perfil-stat-num">
              🔥 {ofensiva}
            </p>

            <p className="perfil-stat-label">
              Ofensiva
            </p>
          </div>

          </div>

        </div>
      </main>
    </>
  )
}