import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { apiFetch } from '../api/api'
import useTitle from '../hooks/useTitle'

const RAIO = 110
const CIRCUNFERENCIA = Math.PI * RAIO

export default function Pomodoro() {
  useTitle('Timer Pomodoro')
  const { user } = useAuth()

  const [minutos, setMinutos] = useState(25)
  const [segundos, setSegundos] = useState(0)
  const [ativo, setAtivo] = useState(false)
  const [iniciado, setIniciado] = useState(false)
  const [ciclosCompletos, setCiclosCompletos] = useState(0)
  const [modoAtual, setModoAtual] = useState('foco')
  const [macas, setMacas] = useState(0)
  const [animacao, setAnimacao] = useState(null)
  const totalSegundosRef = useRef(25 * 60)
  const TOTAL_CICLOS = 4
  const MACAS_POR_CICLO = 5

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // AJUSTES VISUAIS — mexa aqui para customizar
  const COR_ARCO = '#FFFFFF'                    // cor do arco principal
  const COR_TRILHA = 'rgba(30,20,20,0.55)'      // trilha grafite atrás do arco
  const ESPESSURA_ARCO = 5                       // espessura do arco em px
  const TAMANHO_TIMER = '3.7rem'                   // tamanho do cronômetro
  const TAMANHO_LABEL = '1.1rem'                 // tamanho do "Tempo de Foco"
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const tocarSom = useCallback(() => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    gain.gain.setValueAtTime(0.5, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.8)
  }, [])

  const proximoModo = (ciclos) => ciclos % TOTAL_CICLOS === 0 ? 'pausaLonga' : 'pausaCurta'

  const tempoDoModo = (modo) => {
    if (modo === 'foco') return { minutos: 25, segundos: 0, total: 25 * 60 }
    if (modo === 'pausaCurta') return { minutos: 5, segundos: 0, total: 5 * 60 }
    if (modo === 'pausaLonga') return { minutos: 15, segundos: 0, total: 15 * 60 }
  }

  const labelDoModo = (modo) => {
    if (modo === 'foco') return 'Tempo de Foco 🍅'
    if (modo === 'pausaCurta') return 'Pausa Curta ☕'
    if (modo === 'pausaLonga') return 'Pausa Longa 🌿'
  }

  const ganharMacas = (qtd) => {
    setMacas(m => m + qtd)
    setAnimacao(`+${qtd}`)
    setTimeout(() => setAnimacao(null), 1000)
  }

  const reiniciar = () => {
    setAtivo(false); setIniciado(false)
    setCiclosCompletos(0); setMacas(0)
    setModoAtual('foco')
    const t = tempoDoModo('foco')
    setMinutos(t.minutos); setSegundos(t.segundos)
    totalSegundosRef.current = t.total
  }

  const salvarPontos = useCallback(() => {
    apiFetch('/usuarios/adicionar-pontos', { method: 'POST' })
      .catch(err => console.error(err))
  }, [])

  useEffect(() => {
    const t = tempoDoModo(modoAtual)
    setMinutos(t.minutos); setSegundos(t.segundos)
    totalSegundosRef.current = t.total
  }, [modoAtual])

  useEffect(() => {
    if (!ativo) return
    const intervalo = setInterval(() => {
      setSegundos(prev => {
        if (prev > 0) return prev - 1
        setMinutos(prevMin => {
          if (prevMin > 0) return prevMin - 1
          clearInterval(intervalo)
          setAtivo(false); setIniciado(false)
          tocarSom()
          if (modoAtual === 'foco') {
            setCiclosCompletos(ciclos => {
              const n = ciclos + 1
              salvarPontos(); ganharMacas(MACAS_POR_CICLO)
              if (n % TOTAL_CICLOS === 0) {
                alert(`🎉 Parabéns! Você completou ${TOTAL_CICLOS} ciclos!\nVocê ganhou maçãs e pontos bônus! 🍎✨\nAproveite sua pausa longa! 🌿`)
              } else {
                alert('Foco concluído! Você ganhou maçãs! 🍎\nHora de uma pausa curta! ☕')
              }
              setModoAtual(proximoModo(n))
              return n
            })
            return 0
          }
          if (modoAtual === 'pausaLonga') {
            alert('💪 Descansou bem? Vamos mais 4 ciclos! 🍅')
            setCiclosCompletos(0); setMacas(0)
          } else {
            alert('Pausa concluída! Hora de focar! 🍅')
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

  const W = 240, H = 130, CX = W / 2, CY = H

  return (
    <div className="pomodoro-page" style={{
      color: 'white', textAlign: 'center', position: 'relative',
      paddingTop: '8px', justifyContent: 'flex-start'
    }}>

      <style>{`
        @keyframes subirSumir {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-26px); }
        }
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
      `}</style>

      {/* Maçãs */}
      <div style={{ position: 'absolute', top: '12px', right: '24px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}>
        <span>🍎</span>
        <span style={{ color: 'rgba(255,255,255,0.5)' }}>:</span>
        <span style={{ fontWeight: 'bold' }}>{macas}</span>
        {animacao && (
          <span style={{ position: 'absolute', top: '-18px', right: 0, color: '#FFD700', fontWeight: 'bold', fontSize: '0.8rem', animation: 'subirSumir 1s ease-out forwards' }}>
            {animacao}
          </span>
        )}
      </div>

      {user && (
        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
          Olá, <strong>{user.nome}</strong>! Bons estudos! 🍅
        </p>
      )}

      {/* Arco + Timer */}
      <div style={{ position: 'relative', width: `${W}px`, margin: '0 auto 2px' }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
          <path
            d={`M ${CX - RAIO} ${CY} A ${RAIO} ${RAIO} 0 0 1 ${CX + RAIO} ${CY}`}
            fill="none" stroke={COR_TRILHA}
            strokeWidth={ESPESSURA_ARCO} strokeLinecap="round"
          />
          <path
            d={`M ${CX - RAIO} ${CY} A ${RAIO} ${RAIO} 0 0 1 ${CX + RAIO} ${CY}`}
            fill="none" stroke={COR_ARCO}
            strokeWidth={ESPESSURA_ARCO} strokeLinecap="round"
            strokeDasharray={CIRCUNFERENCIA}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>

        <div style={{
          position: 'absolute', bottom: '0px', left: '50%',
          transform: 'translateX(-50%)',
          fontSize: TAMANHO_TIMER,
          fontWeight: '700',
          fontFamily: '"Share Tech Mono", "Courier New", monospace',
          color: 'white', lineHeight: 1, whiteSpace: 'nowrap',
          letterSpacing: '2px',
        }}>
          {String(minutos).padStart(2, '0')}:{String(segundos).padStart(2, '0')}
        </div>
      </div>

      <p style={{ fontSize: TAMANHO_LABEL, margin: '6px 0 10px', fontWeight: '600' }}>
        {labelDoModo(modoAtual)}
      </p>

      {modoAtual === 'foco' && (
        <>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '4px 0' }}>
            {Array.from({ length: TOTAL_CICLOS }).map((_, i) => (
              <div key={i} style={{
                width: '13px', height: '13px', borderRadius: '50%',
                backgroundColor: i < ciclosCompletos % TOTAL_CICLOS ? '#4caf50' : 'transparent',
                border: '2px solid',
                borderColor: i < ciclosCompletos % TOTAL_CICLOS ? '#4caf50' : 'rgba(255,255,255,0.35)',
                transition: 'all 0.3s ease',
              }} />
            ))}
          </div>
          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', margin: '0 0 12px' }}>
            {ciclosCompletos % TOTAL_CICLOS}/{TOTAL_CICLOS} ciclos completos
          </p>
        </>
      )}

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        {!iniciado ? (
          <button onClick={() => { setAtivo(true); setIniciado(true) }} style={btnStyle('#28a745')}>
            {modoAtual === 'foco' ? 'Iniciar Foco' : 'Iniciar Pausa'}
          </button>
        ) : (
          <>
            <button onClick={() => setAtivo(a => !a)} style={btnStyle(ativo ? '#ffc107' : '#28a745')}>
              {ativo ? 'Pausar' : 'Retomar'}
            </button>
            <button onClick={reiniciar} style={btnStyle('#dc3545')}>
              Reiniciar
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function btnStyle(bg) {
  return {
    padding: '10px 28px', fontSize: '1rem', fontWeight: 'bold',
    backgroundColor: bg, color: 'white', border: 'none',
    borderRadius: '5px', cursor: 'pointer',
  }
}