import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { apiFetch } from '../api/api'
import useTitle from '../hooks/useTitle'

const RAIO = 110
const CIRCUNFERENCIA = Math.PI * RAIO

export default function Pomodoro() {
  useTitle('Timer Pomodoro')

  const { user } = useAuth()

  const [minutos, setMinutos] = useState(0)
  const [segundos, setSegundos] = useState(5)
  const [ativo, setAtivo] = useState(false)
  const [iniciado, setIniciado] = useState(false)
  const [ciclosCompletos, setCiclosCompletos] = useState(0)
  const [modoAtual, setModoAtual] = useState('foco')
  const [macas, setMacas] = useState(() => {
    return Number(localStorage.getItem('macas')) || 0
  })
  const [animacao, setAnimacao] = useState(null)
  const [mensagem, setMensagem] = useState('')
  const [arvoreAberta, setArvoreAberta] = useState(false)

  const totalSegundosRef = useRef(5)

  const TOTAL_CICLOS = 4
  const MACAS_POR_CICLO = 5

  const COR_ARCO = '#FFFFFF'
  const COR_TRILHA = 'rgba(30,20,20,0.55)'
  const ESPESSURA_ARCO = 5
  const TAMANHO_TIMER = '3.7rem'
  const TAMANHO_LABEL = '1.1rem'

  const tocarSom = useCallback(() => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    gain.gain.setValueAtTime(0.5, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.8)
  }, [])

  const proximoModo = (ciclos) =>
    ciclos % TOTAL_CICLOS === 0 ? 'pausaLonga' : 'pausaCurta'

  const tempoDoModo = (modo) => {
    if (modo === 'foco') return { minutos: 0, segundos: 5, total: 5 }
    if (modo === 'pausaCurta') return { minutos: 0, segundos: 5, total: 5 }
    return { minutos: 0, segundos: 2, total: 2 }
  }

  const labelDoModo = (modo) => {
    if (modo === 'foco') return 'Tempo de Foco'
    if (modo === 'pausaCurta') return 'Pausa Curta'
    return 'Pausa Longa'
  }

  const ganharMacas = (qtd) => {
    setAnimacao(qtd)
    setTimeout(() => setMacas((m) => {
      const novo = m + qtd
      localStorage.setItem('macas', novo)
      return novo
    }), 600)
    setTimeout(() => setAnimacao(null), 3200)
  }

  const reiniciar = () => {
    setAtivo(false)
    setIniciado(false)
    setCiclosCompletos(0)
    setMacas(0)
    localStorage.setItem('macas', 0)
    setModoAtual('foco')
    const t = tempoDoModo('foco')
    setMinutos(t.minutos)
    setSegundos(t.segundos)
    totalSegundosRef.current = t.total
  }

  const salvarPontos = useCallback(() => {
    apiFetch('/usuarios/adicionar-pontos', {
      method: 'POST'
    }).catch((err) => console.error(err))
  }, [])

  useEffect(() => {
    const t = tempoDoModo(modoAtual)
    setMinutos(t.minutos)
    setSegundos(t.segundos)
    totalSegundosRef.current = t.total
  }, [modoAtual])

  useEffect(() => {
    if (!ativo) return
    const intervalo = setInterval(() => {
      setSegundos((prev) => {
        if (prev > 0) return prev - 1
        setMinutos((prevMin) => {
          if (prevMin > 0) return prevMin - 1
          clearInterval(intervalo)
          setAtivo(false)
          setIniciado(false)
          tocarSom()
          if (modoAtual === 'foco') {
            setCiclosCompletos((ciclos) => {
              const n = ciclos + 1
              salvarPontos()
              ganharMacas(MACAS_POR_CICLO)
              if (n % TOTAL_CICLOS === 0) {
                setMensagem(`Voce completou ${TOTAL_CICLOS} ciclos! Aproveite sua pausa longa`)
              } else {
                setMensagem('Foco concluido! Voce ganhou macas! Hora de uma pausa curta')
              }
              setModoAtual(proximoModo(n))
              return n
            })
            return 0
          }
          if (modoAtual === 'pausaLonga') {
            setMensagem('Descansou bem? Vamos mais 4 ciclos')
            setCiclosCompletos(0)
            setMacas(0)
            localStorage.setItem('macas', 0)
          } else {
            setMensagem('Pausa concluida! Hora de focar')
          }
          setModoAtual('foco')
          return 0
        })
        return 59
      })
    }, 1000)
    return () => clearInterval(intervalo)
  }, [ativo, modoAtual, tocarSom, salvarPontos])

  const restantes = minutos * 60 + segundos
  const progresso = totalSegundosRef.current > 0 ? restantes / totalSegundosRef.current : 1
  const offset = CIRCUNFERENCIA * (1 - progresso)
  const W = 240
  const H = 130
  const CX = W / 2
  const CY = H

  return (
    <div className="pomodoro-page" style={{ position: 'relative' }}>
      <style>{`
        @keyframes subirSumir {
          0%   { opacity: 0; transform: translateY(20px) scale(0.7); }
          20%  { opacity: 1; transform: translateY(0px) scale(1); }
          70%  { opacity: 1; transform: translateY(-20px) scale(1.05); }
          100% { opacity: 0; transform: translateY(-140px) scale(1.2); }
        }
        @keyframes subirMensagem {
          0%   { opacity: 0; transform: translateX(-50%) translateY(-40px); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0px); }
        }

        .card-wrapper {
          display: flex;
          align-items: stretch;
        }

        .timer-card {
          background: var(--color-primary-dark);
          border-radius: 24px 0 0 24px;
          padding: 110px 35px 110px;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow:
            0 0 0 1px rgba(0,0,0,0.2),
            0 0 8px 2px rgba(0,0,0,0.25),
            0 0 20px 6px rgba(0,0,0,0.15),
            0 0 40px 10px rgba(0,0,0,0.08);
          min-width: 300px;
        }

        .botao-arvore {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          background: #5a0e0e;
          border: none;
          border-radius: 0 24px 24px 0;
          cursor: pointer;
          flex-shrink: 0;
          padding: 0;
          box-shadow:
            0 0 0 1px rgba(0,0,0,0.2),
            0 0 8px 2px rgba(0,0,0,0.25),
            0 0 20px 6px rgba(0,0,0,0.15),
            0 0 40px 10px rgba(0,0,0,0.08);
          transition: background 0.2s;
        }

        .botao-arvore:hover {
          background: #6e1010;
        }

        .botao-arvore:active {
          background: #4a0b0b;
          transform: translateY(1px);
        }

        .botao-arvore-icone {
          writing-mode: vertical-rl;
          color: rgba(255,255,255,0.75);
          font-size: 16px;
          font-weight: 900;
          user-select: none;
          letter-spacing: 4px;
          transition: color 0.2s;
          line-height: 1;
        }

        .botao-arvore:hover .botao-arvore-icone {
          color: rgba(255,255,255,1);
        }

        .arvore-painel {
          width: 0;
          overflow: hidden;
          transition: width 0.4s ease;
          background: rgba(0,0,0,0.3);
          border-radius: 0 24px 24px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 0 0 1px rgba(0,0,0,0.2),
            0 0 8px 2px rgba(0,0,0,0.25),
            0 0 20px 6px rgba(0,0,0,0.15),
            0 0 40px 10px rgba(0,0,0,0.08);
        }

        .arvore-painel.aberto {
          width: 260px;
        }
      `}</style>

      {/* Contador de maçãs */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '1.2rem'
      }}>
        <span>🍎</span>
        <span style={{ color: 'rgba(255,255,255,0.5)' }}>:</span>
        <span style={{ fontWeight: 'bold' }}>{macas}</span>
        {animacao && (
          <span style={{
            position: 'absolute',
            top: '-50px',
            right: '-10px',
            color: '#FFD700',
            fontWeight: '900',
            fontSize: '1.3rem',
            zIndex: '9999',
            textShadow: '0 0 5px rgba(255,215,0,0.8), 0 0 10px rgba(255,215,0,0.6), 2px 2px 0 #000',
            animation: 'subirSumir 3s ease-out forwards',
            pointerEvents: 'none'
          }}>
            +{animacao} 🍎
          </span>
        )}
      </div>

      {/* Saudação */}


      {/* Card + botão + painel árvore */}
      <div className="card-wrapper">

        {/* Card do timer */}
        <div className="timer-card">

          {/* Arco meia lua */}
          <div style={{ position: 'relative', width: `${W}px`, margin: '-20px auto 2px' }}>
            <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
              <path
                d={`M ${CX - RAIO} ${CY} A ${RAIO} ${RAIO} 0 0 1 ${CX + RAIO} ${CY}`}
                fill="none"
                stroke={COR_TRILHA}
                strokeWidth={ESPESSURA_ARCO}
                strokeLinecap="round"
              />
              <path
                d={`M ${CX - RAIO} ${CY} A ${RAIO} ${RAIO} 0 0 1 ${CX + RAIO} ${CY}`}
                fill="none"
                stroke={COR_ARCO}
                strokeWidth={ESPESSURA_ARCO}
                strokeLinecap="round"
                strokeDasharray={CIRCUNFERENCIA}
                strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div style={{
              position: 'absolute',
              bottom: '0px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: TAMANHO_TIMER,
              fontWeight: '700',
              fontFamily: '"Share Tech Mono", "Courier New", monospace',
              color: 'white',
              lineHeight: 1,
              whiteSpace: 'nowrap',
              letterSpacing: '2px'
            }}>
              {String(minutos).padStart(2, '0')}:{String(segundos).padStart(2, '0')}
            </div>
          </div>

          {/* Label do modo */}
          <p style={{ fontSize: TAMANHO_LABEL, margin: '6px 0 10px', fontWeight: '600' }}>
            {labelDoModo(modoAtual)}
          </p>

          {/* Bolinhas de ciclo */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '4px 0' }}>
            {Array.from({ length: TOTAL_CICLOS }).map((_, i) => (
              <div key={i} style={{
                width: '13px',
                height: '13px',
                borderRadius: '50%',
                backgroundColor: i < ciclosCompletos % TOTAL_CICLOS ? '#4caf50' : 'transparent',
                border: '2px solid',
                borderColor: i < ciclosCompletos % TOTAL_CICLOS ? '#4caf50' : 'rgba(255,255,255,0.35)',
                transition: 'all 0.3s ease'
              }} />
            ))}
          </div>

          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', margin: '0 0 20px' }}>
            {ciclosCompletos % TOTAL_CICLOS}/{TOTAL_CICLOS} ciclos completos
          </p>

          {/* Botões */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            {!iniciado ? (
              <button
                onClick={() => { setMensagem(''); setAtivo(true); setIniciado(true) }}
                style={{
                  padding: '10px 28px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}>
                {modoAtual === 'foco' ? 'Iniciar Foco' : 'Iniciar Pausa'}
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  onClick={reiniciar}
                  style={{
                    padding: '10px 28px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}>
                  Reiniciar
                </button>
                <button
                  onClick={() => setAtivo((a) => !a)}
                  style={{
                    padding: '10px 28px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    backgroundColor: ativo ? '#ffc107' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}>
                  {ativo ? 'Pausar' : 'Retomar'}
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Botão ||> lateral */}
        <button
          className="botao-arvore"
          onClick={() => setArvoreAberta((a) => !a)}
          title={arvoreAberta ? 'Fechar árvore' : 'Ver árvore'}
        >
          <span className="botao-arvore-icone">
            {arvoreAberta ? '◀  ||' : '||  ▶'}
          </span>
        </button>

        {/* Painel da árvore */}
        <div className={`arvore-painel ${arvoreAberta ? 'aberto' : ''}`}>
          <p style={{
            color: 'rgba(255,255,255,0.3)',
            fontSize: '0.85rem',
            textAlign: 'center',
            padding: '16px',
            whiteSpace: 'nowrap'
          }}>
            🌱 Árvore em breve
          </p>
        </div>

      </div>

      {/* Mensagem de fase */}
      {mensagem && (
        <div style={{
          position: 'fixed',
          top: '25px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#a61d1d',
          borderRadius: '14px',
          padding: '16px 18px',
          minWidth: '320px',
          maxWidth: '500px',
          zIndex: '9999',
          animation: 'subirMensagem 0.35s ease-out',
          boxShadow: '0 10px 25px rgba(0,0,0,0.28)'
        }}>
          <p style={{
            color: 'white',
            fontSize: '0.97rem',
            margin: '0 0 16px',
            textAlign: 'left',
            lineHeight: '1.4'
          }}>
            {mensagem}
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setMensagem('')}
              style={{
                background: '#c62828',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 3px 8px rgba(0,0,0,0.2)'
              }}>
              OK
            </button>
          </div>
        </div>
      )}

    </div>
  )
}