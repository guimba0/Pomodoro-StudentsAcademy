import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { apiFetch } from '../api/api'
import useTitle from '../hooks/useTitle'

export default function Ranking() {
  useTitle('Ranking')
  const { user } = useAuth()
  const [usuarios, setUsuarios] = useState([])
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    apiFetch('/ranking')
      .then(data => {
        if (data.erro) {
          setErro('Não foi possível carregar a classificação.')
        } else {
          setUsuarios(Array.isArray(data) ? data : [])
        }
      })
      .catch(() => setErro('Não foi possível carregar a classificação.'))
      .finally(() => setCarregando(false))
  }, [])

  return (
    <div style={{ padding: '40px', color: 'white', textAlign: 'center' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🏆 Ranking de Maçãs</h2>
      <p style={{ marginBottom: '8px' }}>Veja quem acumulou mais foco! 🍎</p>
      {user && (
        <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '30px' }}>
          Logado como: <strong>{user.nome}</strong>
        </p>
      )}

      {carregando ? (
        <p>Carregando...</p>
      ) : erro ? (
        <p style={{ color: '#ff6b6b' }}>{erro}</p>
      ) : (
        <div style={{ maxWidth: '500px', margin: '0 auto', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid white', height: '40px' }}>
                <th>Posição</th>
                <th>Nome</th>
                <th>Pontos 🍎</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u, index) => (
                <tr
                  key={u.id}
                  style={{
                    height: '40px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    backgroundColor: u.email === user?.email ? 'rgba(76,175,80,0.2)' : 'transparent',
                  }}
                >
                  <td style={{ fontWeight: 'bold' }}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}º`}
                  </td>
                  <td>{u.name || u.nome || 'Estudante'}</td>
                  <td style={{ color: '#4caf50', fontWeight: 'bold' }}>{u.pontos}</td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ padding: '20px' }}>Nenhum estudante no ranking ainda.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
