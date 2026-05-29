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
      <style>{`
        /* SOLUÇÃO PARA O PRETO: Ocupa toda a altura da tela restante e pinta o fundo */
        .loja-outer-wrapper {
          width: 100%;
          background: #A61D1D !important;
          box-sizing: border-box;
          min-height: 100vh;
          padding: 45px 20px 60px 20px;
        }

       .loja-moldura-inferior {
         background: #871414;
         border-radius: 28px;
         padding-bottom: 8px;
         box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
         width: 100%;
         max-width: 1000px;

         /* O primeiro número (75px) controla o quanto o card desce em relação ao menu */
         /* O "auto" garante que ele continue perfeitamente centralizado dos lados */
         margin: 75px auto 0 auto !important;
       }
        /* Card principal */
        .loja-card-principal {
          display: flex;
          background: #C43B3B;
          border-radius: 24px;
          width: 100%;
          min-height: 500px;
          overflow: hidden;
          border: 1px solid #B02A2A;
          box-shadow: inset 0 1px 3px rgba(255, 255, 255, 0.2);
        }

        /* Lateral esquerda de categorias */
        .loja-lateral {
          width: 220px;
          background: rgba(0, 0, 0, 0.12);
          border-right: 1px solid rgba(0, 0, 0, 0.18);
          padding: 24px 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        /* Botões da lateral */
        .loja-aba-btn {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          padding: 14px 24px;
          border: none;
          background: transparent;
          font-size: 1rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.75);
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
        }

        .loja-aba-btn:hover {
          background: rgba(255, 255, 255, 0.04);
          color: #FFFFFF;
        }

        .loja-aba-btn.ativa {
          background: rgba(255, 255, 255, 0.15);
          color: #FFFFFF;
          border-left: 6px solid #FFFFFF;
          padding-left: 18px;
        }

        /* Área interna de compras */
        .loja-conteudo {
          flex: 1;
          padding: 35px;
        }

        .loja-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
          gap: 24px;
        }

        /* Cards de itens */
        .item-card {
          background: #D34E4E;
          border: 1px solid #B53333;
          border-radius: 20px;
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-shadow:
            0 12px 24px rgba(0, 0, 0, 0.35),
            inset 0 1px 2px rgba(255, 255, 255, 0.25);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .item-card:hover {
          transform: translateY(-6px);
          box-shadow:
            0 18px 32px rgba(0, 0, 0, 0.45),
            inset 0 1px 2px rgba(255, 255, 255, 0.35);
        }

        .item-icone-wrapper {
          font-size: 3.8rem;
          margin-bottom: 14px;
          line-height: 1;
          filter: drop-shadow(0 6px 8px rgba(0,0,0,0.25));
        }

        .item-nome {
          font-size: 1rem;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 10px 0;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        .item-preco-linha {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 1rem;
          font-weight: 800;
          color: #FFE6E6;
          margin-bottom: 16px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }

        .loja-btn-comprar {
          background: #28A745;
          color: white;
          border: none;
          border-radius: 24px;
          padding: 10px 24px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          width: 100%;
          transition: background 0.2s, transform 0.1s;
          box-shadow: 0 5px 12px rgba(40, 167, 69, 0.4);
        }

        .loja-btn-comprar:hover {
          background: #218838;
        }

        .item-card.em-breve {
          border: 2px dashed rgba(255, 255, 255, 0.2);
          background: rgba(0, 0, 0, 0.06);
          box-shadow: none;
          justify-content: center;
          transform: none !important;
        }

        .item-card.em-breve .item-nome {
          color: rgba(255, 255, 255, 0.45);
        }
      `}</style>

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
                <div className="item-icone-wrapper" style={{ opacity: 0.35 }}>🎁</div>
                <h4 className="item-nome">Em Breve</h4>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>
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