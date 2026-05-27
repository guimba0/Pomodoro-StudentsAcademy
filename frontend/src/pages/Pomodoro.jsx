import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { apiFetch } from '../api/api'
import useTitle from '../hooks/useTitle'

const FOCUS_MIN = 25
const SHORT_BREAK_MIN = 5
const LONG_BREAK_MIN = 15
const TOTAL_CYCLES = 4

const RAIO = 110
const CIRCUNFERENCIA = Math.PI * RAIO
const W = 240
const H = 130
const CX = W / 2
const CY = H

export default function Pomodoro() {
  useTitle('Timer Pomodoro')
  const { user } = useAuth()
  const isAuthed = !!user

  const [status, setStatus] = useState('idle')
  const [remaining, setRemaining] = useState(FOCUS_MIN * 60)
  const [mode, setMode] = useState('focus')
  const [sessionId, setSessionId] = useState(null)
  const [cycleCount, setCycleCount] = useState(0)
  const [apples, setApples] = useState(() => Number(localStorage.getItem('macas')) || 0)
  const [recovered, setRecovered] = useState(false)
  const [message, setMessage] = useState('')
  const [progresso, setProgresso] = useState(null)
  const [showTreePanel, setShowTreePanel] = useState(false)
  const [animacao, setAnimacao] = useState(null)
  const [treeData, setTreeData] = useState(null)

  const totalRef = useRef(FOCUS_MIN * 60)
  const hasAttemptedRecovery = useRef(false)
  const intervalRef = useRef(null)
  const timerFinishedRef = useRef(false)
  const cycleRef = useRef(0)

  useEffect(() => { cycleRef.current = cycleCount }, [cycleCount])

  const getDuration = (m) => {
    if (m === 'focus') return FOCUS_MIN * 60
    if (m === 'shortBreak') return SHORT_BREAK_MIN * 60
    return LONG_BREAK_MIN * 60
  }

  const labelDoModo = (m) => {
    if (m === 'focus') return 'Tempo de Foco'
    if (m === 'shortBreak') return 'Pausa Curta'
    return 'Pausa Longa'
  }

  const proximoModo = (ciclos) =>
    ciclos % TOTAL_CYCLES === 0 ? 'longBreak' : 'shortBreak'

  const tocarSom = useCallback(() => {
    try {
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
    } catch { }
  }, [])

  const ganharMacas = (qtd) => {
    setAnimacao(qtd)
    setTimeout(() => setApples((m) => {
      const novo = m + qtd
      localStorage.setItem('macas', novo)
      return novo
    }), 600)
    setTimeout(() => setAnimacao(null), 3200)
  }

  const fetchTreeData = useCallback(async () => {
    if (!isAuthed) return
    const data = await apiFetch('/pomodoro/progresso')
    if (data && !data.erro) {
      setProgresso(data)
      setTreeData({
        estagio: data.arvoreEstagio,
        morta: data.arvoreMorta,
        focosCompletos: data.focosCompletos,
      })
    }
  }, [isAuthed])

  const startFocusSession = useCallback(async () => {
    const data = await apiFetch('/pomodoro/start', {
      method: 'POST',
      body: JSON.stringify({ tipo: 'FOCUS' }),
    })
    if (data.erro) {
      setMessage('Erro ao iniciar sessão: ' + data.erro)
      return
    }
    setSessionId(data.id)
    const rem = data.tempoRestanteSegundos ?? getDuration('focus')
    timerFinishedRef.current = false
    setRemaining(rem)
    totalRef.current = getDuration('focus')
    if (rem > 0) {
      setStatus('running')
      if (data.recuperada) {
        setRecovered(true)
        setMessage('Sessão recuperada! Você tem ' + Math.ceil(rem / 60) + ' minutos restantes.')
      }
    } else {
      setStatus('completed')
      setMessage('Foco já concluído! Clique em Finalizar para receber suas recompensas.')
    }
  }, [])

  const startLocalTimer = useCallback(() => {
    timerFinishedRef.current = false
    setStatus('running')
  }, [])

  const finishFocusSession = useCallback(async () => {
    tocarSom()
    const data = await apiFetch('/pomodoro/finish', { method: 'POST' })
    if (data.erro) {
      setMessage('Erro ao finalizar: ' + data.erro)
      setStatus('idle')
      return
    }

    ganharMacas(5)
    const n = cycleRef.current + 1
    setCycleCount(n)
    const prox = proximoModo(n)
    setMode(prox)
    setSessionId(null)
    setStatus('idle')
    const dur = getDuration(prox)
    setRemaining(dur)
    totalRef.current = dur

    let msg = `Foco concluído! +${data.pontosGanhos} pontos`
    if (data.tomatesGanhos > 0) msg += `, +${data.tomatesGanhos} tomates`
    if (n % TOTAL_CYCLES === 0) {
      msg += `. Você completou ${TOTAL_CYCLES} ciclos! Aproveite sua pausa longa`
    } else {
      msg += '. Hora de uma pausa curta'
    }
    setMessage(msg)
    fetchTreeData()
  }, [tocarSom, fetchTreeData])

  const handleFocusCompleteLocal = useCallback(() => {
    tocarSom()
    const n = cycleRef.current + 1
    setCycleCount(n)
    const prox = proximoModo(n)
    setMode(prox)
    setStatus('idle')
    const dur = getDuration(prox)
    setRemaining(dur)
    totalRef.current = dur
    ganharMacas(5)
    if (n % TOTAL_CYCLES === 0) {
      setMessage(`Você completou ${TOTAL_CYCLES} ciclos! Aproveite sua pausa longa`)
    } else {
      setMessage('Foco concluído! Hora de uma pausa curta')
    }
  }, [tocarSom])

  const handleBreakComplete = useCallback(() => {
    tocarSom()
    setMode('focus')
    setStatus('idle')
    const dur = FOCUS_MIN * 60
    setRemaining(dur)
    totalRef.current = dur
    setMessage(cycleRef.current === 0 ? 'Pausa concluída! Hora de focar' : 'Descansou bem? Hora de focar')
  }, [tocarSom])

  const resetTimer = useCallback(async () => {
    if (status === 'running' || status === 'paused') {
      if (isAuthed && sessionId) {
        await apiFetch('/pomodoro/reset', { method: 'POST' })
      }
      setSessionId(null)
    }
    setStatus('idle')
    setRemaining(FOCUS_MIN * 60)
    totalRef.current = FOCUS_MIN * 60
    setMode('focus')
    setCycleCount(0)
    setApples(0)
    localStorage.setItem('macas', 0)
    setRecovered(false)
    timerFinishedRef.current = false
  }, [isAuthed, status, sessionId])

  // --- Recovery + failure detection on mount ---
  useEffect(() => {
    if (isAuthed && !hasAttemptedRecovery.current) {
      hasAttemptedRecovery.current = true
      apiFetch('/pomodoro/current').then((data) => {
        if (data && !data.erro && data.id) {
          const rem = data.tempoRestanteSegundos ?? 0
          setSessionId(data.id)
          setRemaining(rem)
          totalRef.current = FOCUS_MIN * 60
          setRecovered(true)
          if (rem > 0) {
            setStatus('running')
            setMessage('Sessão recuperada! Você tem ' + Math.ceil(rem / 60) + ' minutos restantes.')
          } else {
            setStatus('completed')
            setMessage('Foco já concluído! Clique em Finalizar para receber suas recompensas.')
          }
        } else {
          apiFetch('/pomodoro/progresso').then((p) => {
            if (p && !p.erro) {
              setProgresso(p)
              setTreeData({
                estagio: p.arvoreEstagio,
                morta: p.arvoreMorta,
                focosCompletos: p.focosCompletos,
              })
              if (p.arvoreMorta) {
                setMessage('Sessão anterior falhou por abandono. Sua árvore morreu. Inicie um novo foco para plantar uma nova.')
              }
            }
          })
        }
      }).catch(() => { })
    }
  }, [isAuthed])

  // --- Fetch tree data on mount ---
  useEffect(() => {
    fetchTreeData()
  }, [fetchTreeData])

  // --- Countdown interval (runs only in 'running' status) ---
  useEffect(() => {
    if (status !== 'running') return
    timerFinishedRef.current = false
    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(id)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    intervalRef.current = id
    return () => clearInterval(id)
  }, [status])

  // --- Detect when timer reaches 0 ---
  useEffect(() => {
    if (status !== 'running' || remaining > 0 || timerFinishedRef.current) return
    timerFinishedRef.current = true

    if (mode === 'focus') {
      if (isAuthed) {
        tocarSom()
        setStatus('completed')
        setMessage('Foco concluído! Clique em Finalizar para receber suas recompensas.')
      } else {
        handleFocusCompleteLocal()
      }
    } else {
      handleBreakComplete()
    }
  }, [remaining, status, mode, isAuthed, tocarSom, handleFocusCompleteLocal, handleBreakComplete])

  const restantes = remaining
  const progressoAtual = totalRef.current > 0 ? restantes / totalRef.current : 1
  const offset = CIRCUNFERENCIA * (1 - progressoAtual)

  const treeEmoji = () => {
    if (!treeData) return '🌱'
    if (treeData.morta) return '💀'
    if (treeData.estagio === 'TREE') return '🌳'
    if (treeData.estagio === 'SEEDLING') return '🌿'
    return '🌱'
  }

  const treeLabel = () => {
    if (!treeData) return 'Semente'
    if (treeData.morta) return 'Morta'
    if (treeData.estagio === 'TREE') return 'Árvore'
    if (treeData.estagio === 'SEEDLING') return 'Muda'
    return 'Semente'
  }

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

        .botao-arvore:hover { background: #6e1010; }
        .botao-arvore:active { background: #4a0b0b; transform: translateY(1px); }

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

        .botao-arvore:hover .botao-arvore-icone { color: rgba(255,255,255,1); }

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

        .arvore-painel.aberto { width: 260px; }

        .arvore-conteudo {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 20px;
          color: white;
          text-align: center;
        }

        .arvore-icone-grande {
          font-size: 4rem;
          line-height: 1;
        }

        .arvore-label {
          font-size: 1.1rem;
          font-weight: 700;
        }

        .arvore-stats {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.65);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .arvore-stats span {
          display: flex;
          justify-content: space-between;
          gap: 12px;
        }

        .arvore-stats .valor {
          color: white;
          font-weight: 600;
        }

        .arvore-morta { color: #ff6b6b; }
        .arvore-viva { color: #4caf50; }
      `}</style>

      {/* Apple counter */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '1.2rem'
      }}>
        <span style={{ fontSize: '1.3rem' }}>🍎</span>
        <span style={{ color: 'rgba(255,255,255,0.5)' }}>:</span>
        <span style={{ fontWeight: 'bold' }}>{apples}</span>
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

      {/* Recovery badge */}
      {recovered && (
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '24px',
          background: '#ffc107',
          color: '#000',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
        }}>
          ↩ Sessão recuperada
        </div>
      )}

      {/* Card + tree panel */}
      <div className="card-wrapper">

        {/* Timer card */}
        <div className="timer-card">

          {/* SVG arc */}
          <div style={{ position: 'relative', width: `${W}px`, margin: '-20px auto 2px' }}>
            <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
              <path
                d={`M ${CX - RAIO} ${CY} A ${RAIO} ${RAIO} 0 0 1 ${CX + RAIO} ${CY}`}
                fill="none"
                stroke="rgba(30,20,20,0.55)"
                strokeWidth={5}
                strokeLinecap="round"
              />
              <path
                d={`M ${CX - RAIO} ${CY} A ${RAIO} ${RAIO} 0 0 1 ${CX + RAIO} ${CY}`}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth={5}
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
              fontSize: '3.7rem',
              fontWeight: '700',
              fontFamily: '"Share Tech Mono", "Courier New", monospace',
              color: 'white',
              lineHeight: 1,
              whiteSpace: 'nowrap',
              letterSpacing: '2px'
            }}>
              {String(Math.floor(restantes / 60)).padStart(2, '0')}:
              {String(restantes % 60).padStart(2, '0')}
            </div>
          </div>

          {/* Mode label */}
          <p style={{ fontSize: '1.1rem', margin: '6px 0 10px', fontWeight: '600' }}>
            {labelDoModo(mode)}
          </p>

          {/* Cycle dots */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '4px 0' }}>
            {Array.from({ length: TOTAL_CYCLES }).map((_, i) => (
              <div key={i} style={{
                width: '13px',
                height: '13px',
                borderRadius: '50%',
                backgroundColor: i < cycleCount % TOTAL_CYCLES ? '#4caf50' : 'transparent',
                border: '2px solid',
                borderColor: i < cycleCount % TOTAL_CYCLES ? '#4caf50' : 'rgba(255,255,255,0.35)',
                transition: 'all 0.3s ease'
              }} />
            ))}
          </div>

          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', margin: '0 0 20px' }}>
            {cycleCount % TOTAL_CYCLES}/{TOTAL_CYCLES} ciclos completos
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>

            {status === 'idle' && (
              <button
                onClick={mode === 'focus' && isAuthed ? startFocusSession : startLocalTimer}
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
                {mode === 'focus' ? 'Iniciar Foco' : 'Iniciar ' + (mode === 'shortBreak' ? 'Pausa Curta' : 'Pausa Longa')}
              </button>
            )}

            {status === 'completed' && isAuthed && (
              <button
                onClick={finishFocusSession}
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
                Finalizar e Receber Recompensas
              </button>
            )}

            {(status === 'running' || status === 'paused') && (
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  onClick={resetTimer}
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
                  onClick={() => setStatus((s) => s === 'running' ? 'paused' : 'running')}
                  style={{
                    padding: '10px 28px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    backgroundColor: status === 'running' ? '#ffc107' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}>
                  {status === 'running' ? 'Pausar' : 'Retomar'}
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Tree toggle button */}
        <button
          className="botao-arvore"
          onClick={() => setShowTreePanel((a) => !a)}
          title={showTreePanel ? 'Fechar árvore' : 'Ver árvore'}
        >
          <span className="botao-arvore-icone">
            {showTreePanel ? '◀  ||' : '||  ▶'}
          </span>
        </button>

        {/* Tree panel */}
        <div className={`arvore-painel ${showTreePanel ? 'aberto' : ''}`}>
          {isAuthed ? (
            <div className="arvore-conteudo">
              <div className="arvore-icone-grande">
                {treeEmoji()}
              </div>
              <div className={`arvore-label ${treeData?.morta ? 'arvore-morta' : 'arvore-viva'}`}>
                {treeLabel()}
              </div>
              {treeData?.morta && (
                <div style={{ color: '#ff6b6b', fontSize: '0.85rem', fontWeight: 600 }}>
                  Sua árvore morreu por abandono. Inicie um novo foco para plantar uma nova.
                </div>
              )}
              <div className="arvore-stats">
                <span>Focos completos: <span className="valor">{treeData?.focosCompletos ?? 0}</span></span>
                <span>Pontos: <span className="valor">{progresso?.pontos ?? 0}</span></span>
                <span>Tomates: <span className="valor">{progresso?.tomates ?? 0}</span></span>
              </div>
            </div>
          ) : (
            <p style={{
              color: 'rgba(255,255,255,0.3)',
              fontSize: '0.85rem',
              textAlign: 'center',
              padding: '16px',
              whiteSpace: 'nowrap'
            }}>
              Faça login para ter sua árvore
            </p>
          )}
        </div>

      </div>

      {/* Message toast */}
      {message && (
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
            {message}
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => { setMessage(''); setRecovered(false) }}
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
