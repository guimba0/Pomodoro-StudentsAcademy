import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export default function Loja() {
  const { user } = useAuth()

  const [categoriaAtiva, setCategoriaAtiva] = useState('sementes')

  const categorias = [
    { id: 'sementes', label: 'Sementes', icone: '🌱' },
    { id: 'vasos', label: 'Vasos', icone: '🏺' },
    { id: 'plantas', label: 'Plantas', icone: '🌵' },
    { id: 'fundos', label: 'Fundos', icone: '🖼️' },
    { id: 'outros', label: 'Outros', icone: '🛒' }
  ]

  const itensDaLoja = {
    sementes: [
      { id: 'sem_fatec', nome: 'Semente da FATEC', preco: 50, icone: '📦' },
      { id: 'sem_ouro', nome: 'Semente Dourada', preco: 100, icone: '🌟' }
    ],
    vasos: [
      { id: 'vaso_cyber', nome: 'Vaso Cyberpunk', preco: 30, icone: '🤖' },
      { id: 'vaso_barro', nome: 'Vaso de Terracotta', preco: 20, icone: '🏺' }
    ],
    plantas: [
      { id: 'cactus_monge', nome: 'Cacto Monge', preco: 50, icone: '🌵' },
      { id: 'bonsai_zen', nome: 'Bonsai Zen', preco: 80, icone: '🌳' }
    ],
    fundos: [
      { id: 'fundo_floresta', nome: 'Cenário Floresta', preco: 50, icone: '🌲' },
      { id: 'fundo_espaco', nome: 'Cenário Espacial', preco: 70, icone: '🌌' }
    ],
    outros: [
      { id: 'som_retro', nome: 'Alarme Retro Mario', preco: 40, icone: '🎵' }
    ]
  }

  const itensExibidos = itensDaLoja[categoriaAtiva] || []

  return (
    <div className="loja-outer-wrapper">

      {/* Caixa estrutural perfeitamente centralizada */}
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
            <div className="loja-grid">
              {itensExibidos.map((item) => (
                <div key={item.id} className="item-card">
                  <div className="item-icone-wrapper">{item.icone}</div>
                  <h4 className="item-nome">{item.nome}</h4>
                  <div className="item-preco-linha">
                    <span>🍅</span> {item.preco}
                  </div>
                  <button className="loja-btn-comprar">
                    Comprar
                  </button>
                </div>
              ))}

              <div className="item-card em-breve">
                <div className="item-icone-wrapper">🎁</div>
                <h4 className="item-nome">Em Breve</h4>
                <span className="em-breve-label">
                  Item Surpresa
                </span>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}