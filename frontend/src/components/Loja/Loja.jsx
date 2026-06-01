import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { apiFetch } from '../../api/api'

const CATALOGO = {
  pato: { tipo: 'avatar', nome: 'Pato', path: '/img/PomodoroStore/Icon/Pato_PI.png', preco: 3 },
  ceu: { tipo: 'wallpaper', nome: 'Céu', path: '/img/PomodoroStore/Wallpaper/Ceu_WP.jpg', preco: 5 },
}

export default function Loja() {
  const { user, setUser } = useAuth()
  const [categoriaAtiva, setCategoriaAtiva] = useState('perfil')
  const [itens, setItens] = useState([])
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    apiFetch('/loja/itens').then(data => {
      if (data && !data.erro) setItens(data.itens || [])
    })
  }, [])

  const categorias = [
    { id: 'perfil', label: 'Perfil', icone: '👤' },
    { id: 'sementes', label: 'Sementes', icone: '🌱' },
    { id: 'vasos', label: 'Vasos', icone: '🏺' },
    { id: 'plantas', label: 'Plantas', icone: '🌵' },
    { id: 'fundos', label: 'Fundos', icone: '🖼️' },
    { id: 'outros', label: 'Outros', icone: '🛒' },
  ]

  function isDono(itemId) {
    return itens.includes(itemId)
  }

  function isAtivo(itemId) {
    const item = CATALOGO[itemId]
    if (!item) return false
    if (item.tipo === 'avatar') return user?.avatar === item.path
    if (item.tipo === 'wallpaper') return user?.wallpaper === item.path
    return false
  }

  async function handleComprar(itemId) {
    setMsg('')
    setLoading(true)
    try {
      const data = await apiFetch('/loja/comprar', {
        method: 'POST',
        body: JSON.stringify({ itemId }),
      })
      if (data.erro) {
        setMsg(data.erro)
      } else {
        setMsg('Item comprado com sucesso!')
        setItens(prev => [...prev, itemId])
        const item = CATALOGO[itemId]
        if (item && user) {
          const updated = { ...user }
          if (item.tipo === 'avatar') updated.avatar = item.path
          if (item.tipo === 'wallpaper') updated.wallpaper = item.path
          setUser(updated)
          localStorage.setItem('pomodoro_user', JSON.stringify(updated))
        }
      }
    } catch {
      setMsg('Erro de conexão.')
    } finally {
      setLoading(false)
      setTimeout(() => setMsg(''), 3000)
    }
  }

  return (
    <div className="loja-outer-wrapper">

      <div className="loja-header">
        <svg className="loja-cart-icon" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        <h1 className="loja-title">Loja</h1>
      </div>

      <div className="loja-moldura-inferior">
        <div className="loja-card-principal">
          <aside className="loja-lateral">
            {categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoriaAtiva(cat.id)}
                className={`loja-aba-btn ${categoriaAtiva === cat.id ? 'ativa' : ''}`}
              >
                <span>{cat.icone}</span>
                {cat.label}
              </button>
            ))}
          </aside>

          <main className="loja-conteudo">
            {msg && <div className="loja-msg-inline">{msg}</div>}

            {categoriaAtiva === 'perfil' ? (
              <div className="loja-grid">
                {Object.entries(CATALOGO).map(([id, item]) => {
                  const dono = isDono(id)
                  const ativo = isAtivo(id)
                  return (
                    <div key={id} className={`item-card${dono ? ' item-own' : ''}`}>
                      {item.tipo === 'avatar' ? (
                        <img className="item-img" src={item.path} alt={item.nome} />
                      ) : (
                        <div className="item-wallpaper-thumb" style={{ backgroundImage: `url(${item.path})` }} />
                      )}
                      <h4 className="item-nome">{item.nome} <span className="item-tipo">- {item.tipo === 'avatar' ? 'Ícone' : 'Plano de fundo'}</span></h4>
                      <div className="item-preco-linha">
                        <span>🍅</span> {item.preco}
                      </div>
                      {dono ? (
                        <span className="item-status">{ativo ? '✓ Usando' : '✓ Desbloqueado'}</span>
                      ) : (
                        <button className="loja-btn-comprar" onClick={() => handleComprar(id)} disabled={loading}>
                          {loading ? '...' : 'Comprar'}
                        </button>
                      )}
                    </div>
                  )
                })}
                <div className="item-card em-breve">
                  <div className="item-icone-wrapper">🎁</div>
                  <h4 className="item-nome">Em Breve</h4>
                  <span className="em-breve-label">Mais itens em breve</span>
                </div>
              </div>
            ) : (
              <div className="loja-grid">
                <div className="item-card em-breve">
                  <div className="item-icone-wrapper">🎁</div>
                  <h4 className="item-nome">Em Breve</h4>
                  <span className="em-breve-label">Em desenvolvimento</span>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

    </div>
  )
}
