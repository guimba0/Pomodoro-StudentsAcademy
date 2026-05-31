import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { apiFetch } from '../api/api'
import useTitle from '../hooks/useTitle'

const TEST_SECONDS = 5
const TOTAL_CYCLES = 4

const RAIO = 110
const CIRCUNFERENCIA = Math.PI * RAIO + 2
const W = 240
const H = 130
const CX = W / 2
const CY = H

const getDuration = (m) => {
  if (m === 'focus') return TEST_SECONDS
  if (m === 'shortBreak') return TEST_SECONDS
  return 2
}

export default function Pomodoro() {
  useTitle('Timer Pomodoro')
  const { user } = useAuth()
  const isAuthed = !!user

  const [status, setStatus] = useState('idle')
  const [remaining, setRemaining] = useState(TEST_SECONDS)
  const [mode, setMode] = useState('focus')
  const [sessionId, setSessionId] = useState(null)
  const [cycleCount, setCycleCount] = useState(0)
  const [tomateCount, setTomateCount] = useState(0)
  const [recovered, setRecovered] = useState(false)
  const [message, setMessage] = useState('')
  const [progresso, setProgresso] = useState(null)
  const [showTreePanel, setShowTreePanel] = useState(false)
  const [animacao, setAnimacao] = useState(null)
  const [treeData, setTreeData] = useState(null)
  const [regando, setRegando] = useState(false)
  const [modoAnterior, setModoAnterior] = useState('focus')

  const totalRef = useRef(TEST_SECONDS)
  const startedAtRef = useRef(null)
  const hasAttemptedRecovery = useRef(false)
  const intervalRef = useRef(null)
  const timerFinishedRef = useRef(false)
  const cycleRef = useRef(0)
  const [elapsedMs, setElapsedMs] = useState(0)

  useEffect(() => { cycleRef.current = cycleCount }, [cycleCount])

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

  const fetchTreeData = useCallback(async (sincronizarTomate = false) => {
    if (!isAuthed) return
    const data = await apiFetch('/pomodoro/progresso')
    if (data && !data.erro) {
      setProgresso(data)
      if (sincronizarTomate) {
        setTomateCount(data.tomates ?? 0)
      }
      setTreeData({
        estagio: data.arvoreEstagio,
        morta: data.arvoreMorta,
        focosCompletos: data.focosCompletos,
      })
    }
  }, [isAuthed])

  const startFocusSession = useCallback(async () => {
    setMessage('')
    const data = await apiFetch('/pomodoro/start', {
      method: 'POST',
      body: JSON.stringify({ tipo: 'FOCUS' }),
    })
    if (data.erro) {
      setMessage('Erro ao iniciar sessão: ' + data.erro)
      return
    }
    setSessionId(data.id)
    const duracao = getDuration('focus')
    timerFinishedRef.current = false
    setRemaining(duracao)
    totalRef.current = duracao
    setStatus('running')
    startedAtRef.current = Date.now()
    if (data.recuperada) {
      setRecovered(true)
      setMessage('Sessão recuperada!')
    }
  }, [])

  const startLocalTimer = useCallback(() => {
    timerFinishedRef.current = false
    const duracao = getDuration(mode)
    setRemaining(duracao)
    totalRef.current = duracao
    setStatus('running')
    startedAtRef.current = Date.now()
  }, [mode])

  // Retorna quantos tomates ganhou, sem mexer no estado
  const finishFocusSession = useCallback(async () => {
    tocarSom()
    const data = await apiFetch('/pomodoro/finish', { method: 'POST' })
    if (data.erro) {
      setMessage('Erro ao finalizar: ' + data.erro)
      setStatus('idle')
      return 0
    }

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
    fetchTreeData(false)

    return data.tomatesGanhos ?? 0
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
    const dur = getDuration('focus')
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
    const dur = getDuration('focus')
    setStatus('idle')
    setRemaining(dur)
    totalRef.current = dur
    setMode('focus')
    setCycleCount(0)
    if (isAuthed) setTomateCount(0)
    setRecovered(false)
    timerFinishedRef.current = false
  }, [isAuthed, status, sessionId])

  const handleFinalizarEIniciar = useCallback(async () => {
    setAnimacao(10)
    setRegando(true)
    setTimeout(() => setRegando(false), 2500)
    setRegando(true)
    setTimeout(() => setRegando(false), 2500)
    setTimeout(() => setTomateCount((m) => m + 10), 1000)
    setTimeout(() => setAnimacao(null), 4500)

    await finishFocusSession()
    startLocalTimer()
  }, [finishFocusSession, startLocalTimer])

  useEffect(() => {
    if (isAuthed && !hasAttemptedRecovery.current) {
      hasAttemptedRecovery.current = true
      apiFetch('/pomodoro/current').then((data) => {
        if (data && !data.erro && data.id) {
          const duracao = getDuration('focus')
          setSessionId(data.id)
          setRemaining(duracao)
          totalRef.current = duracao
          setRecovered(true)
          setStatus('running')
          setMessage('Sessão recuperada!')
          startedAtRef.current = Date.now()
        } else {
          apiFetch('/pomodoro/progresso').then((p) => {
            if (p && !p.erro) {
              setProgresso(p)
              setTomateCount(p.tomates ?? 0)
              setTreeData({
                estagio: p.arvoreEstagio,
                morta: p.arvoreMorta,
                focosCompletos: p.focosCompletos,
              })
              if (p.arvoreMorta) {
                setMessage('Sessão anterior falhou. Sua árvore morreu. Inicie um novo foco para plantar uma nova.')
              }
            }
          })
        }
      }).catch(() => { })
    }
  }, [isAuthed])

  useEffect(() => {
    fetchTreeData(true)
  }, [fetchTreeData])

  useEffect(() => {
    if (status !== 'running') return
    timerFinishedRef.current = false
    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) { clearInterval(id); return 0 }
        return prev - 1
      })
    }, 1000)
    intervalRef.current = id
    return () => clearInterval(id)
  }, [status])

  useEffect(() => {
    if (status !== 'running') {
      setElapsedMs(0)
      return
    }
    const id = setInterval(() => {
      if (startedAtRef.current) {
        setElapsedMs(Date.now() - startedAtRef.current)
      }
    }, 50)
    return () => clearInterval(id)
  }, [status])

  useEffect(() => {
    if (status !== 'running' || remaining > 0 || timerFinishedRef.current) return
    timerFinishedRef.current = true
   if (mode === 'focus') {
         if (isAuthed) {
           tocarSom()
           setModoAnterior(mode)
           setAnimacao(10)
           setRegando(true)
           setTimeout(() => setRegando(false), 2500)
           setTimeout(() => setTomateCount((m) => m + 10), 1500)
           setTimeout(() => setAnimacao(null), 5000)
           setStatus('completed')
           setMessage('')
         } else {
        handleFocusCompleteLocal()
      }
    } else {
      handleBreakComplete()
    }
  }, [remaining, status, mode, isAuthed, tocarSom, handleFocusCompleteLocal, handleBreakComplete])

  const smoothProgress = (status === 'running' || status === 'paused') && startedAtRef.current
    ? Math.max(1 - (elapsedMs / 1000) / totalRef.current, 0)
    : (totalRef.current > 0 ? remaining / totalRef.current : 1)
  const offset = CIRCUNFERENCIA * (1 - smoothProgress)

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
                 0%   { opacity: 0; transform: translateY(10px) scale(0.8); }
                 15%  { opacity: 1; transform: translateY(0px) scale(1.3); }
                 60%  { opacity: 1; transform: translateY(-50px) scale(1.0); }
                 100% { opacity: 0; transform: translateY(-90px) scale(0.9); }
               }
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
                .arvore-painel.aberto { width: 420px; }
                .arvore-conteudo {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  gap: 10px;
                  padding: 16px;
                  color: white;
                  text-align: center;
                  width: 420px;
                }
                .arvore-imagem-wrapper {
                  position: relative;
                  width: 360px;
                  height: 260px;
                  border-radius: 16px;
                  overflow: hidden;
                }
                .arvore-imagem {
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                  border-radius: 16px;
                  transition: opacity 0.8s ease;
                }
                .arvore-imagem.trocando { opacity: 0; }
                @keyframes regarMover {
                  0%   { transform: translate(0px, 0px) rotate(0deg); }
                  30%  { transform: translate(-30px, -10px) rotate(-25deg); }
                  55%  { transform: translate(-40px, 5px) rotate(-35deg); }
                  80%  { transform: translate(-30px, -10px) rotate(-25deg); }
                  100% { transform: translate(0px, 0px) rotate(0deg); }
                }
                @keyframes gotasCair {
                  0%   { opacity: 0; transform: translateY(0px); }
                  30%  { opacity: 1; }
                  100% { opacity: 0; transform: translateY(20px); }
                }
                .regador-wrapper {
                  position: absolute;
                  bottom: 18px;
                  right: 18px;
                  width: 54px;
                  height: 54px;
                  animation: regarMover 2.5s ease-in-out forwards;
                }
                .regador-wrapper.parado { animation: none; }
                .gota {
                  position: absolute;
                  width: 4px;
                  height: 8px;
                  background: #5bb8ff;
                  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
                  animation: gotasCair 0.6s ease-in infinite;
                }
                .gota:nth-child(1) { left: 2px;  top: -10px; animation-delay: 0s; }
                .gota:nth-child(2) { left: 10px; top: -14px; animation-delay: 0.15s; }
                .gota:nth-child(3) { left: 18px; top: -10px; animation-delay: 0.3s; }
                .arvore-label { font-size: 1rem; font-weight: 700; }
                .arvore-stats {
                  font-size: 0.82rem;
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
                .arvore-stats .valor { color: white; font-weight: 600; }
                .arvore-morta { color: #ff6b6b; }
                .arvore-viva { color: #4caf50; }
      `}</style>

      {isAuthed && (
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '1.2rem'
        }}>
          <span style={{ fontSize: '1.3rem' }}>🍅</span>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>:</span>
          <span style={{ fontWeight: 'bold' }}>{tomateCount}</span>
      {animacao && (
        <span style={{
          position: 'absolute',
          top: '-20px',
          right: '10px',
          color: '#FFD700',
          fontWeight: '900',
          fontSize: '1.1rem',
          zIndex: '9999',
          textShadow: '0 0 5px rgba(255,215,0,0.8), 2px 2px 0 #000',
          animation: 'subirSumir 4s ease-out forwards',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          display: 'inline-block'
        }}>
          +{animacao} 🍅
        </span>
      )}
        </div>
      )}

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

      <div className="card-wrapper">
        <div className="timer-card">

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
                style={{ transition: 'none' }}
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
              {String(Math.floor(remaining / 60)).padStart(2, '0')}:
              {String(remaining % 60).padStart(2, '0')}
            </div>
          </div>

          <p style={{ fontSize: '1.1rem', margin: '6px 0 10px', fontWeight: '600' }}>
            {labelDoModo(mode)}
          </p>

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

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>

            {status === 'idle' && (
              <button
                onClick={mode === 'focus' && isAuthed ? startFocusSession : startLocalTimer}
                className="pomodoro-btn pomodoro-btn-green">
                {mode === 'focus' ? 'Iniciar Foco' : 'Iniciar ' + (mode === 'shortBreak' ? 'Pausa Curta' : 'Pausa Longa')}
              </button>
            )}

            {status === 'completed' && isAuthed && (
              <button
                onClick={handleFinalizarEIniciar}
                className="pomodoro-btn pomodoro-btn-green">
                {modoAnterior === 'focus' ? 'Iniciar Pausa Curta' : 'Iniciar Foco'}
              </button>
            )}

            {(status === 'running' || status === 'paused') && (
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  onClick={resetTimer}
                  className="pomodoro-btn pomodoro-btn-red">
                  Reiniciar
                </button>
                <button
                  onClick={() => setStatus((s) => s === 'running' ? 'paused' : 'running')}
                  className={`pomodoro-btn ${status === 'running' ? 'pomodoro-btn-yellow' : 'pomodoro-btn-green'}`}>
                  {status === 'running' ? 'Pausar' : 'Retomar'}
                </button>
              </div>
            )}

          </div>
        </div>

        <button
          className="botao-arvore"
          onClick={() => setShowTreePanel((a) => !a)}
          title={showTreePanel ? 'Fechar árvore' : 'Ver árvore'}
        >
          <span className="botao-arvore-icone">
            {showTreePanel ? '◀  ||' : '||  ▶'}
          </span>
        </button>

        <div className={`arvore-painel ${showTreePanel ? 'aberto' : ''}`}>
          {isAuthed ? (
            <div className="arvore-conteudo">
                          <div className="arvore-imagem-wrapper">
                            <img
                              className="arvore-imagem"
                           src={
                             treeData?.morta
                               ? '/img/estagio1.jpg'
                               : treeData?.estagio === 'TREE'
                                 ? '/img/estagio3.jpg'
                                 : treeData?.estagio === 'SEEDLING'
                                   ? '/img/estagio2.jpg'
                                   : '/img/estagio1.jpg'
                           }
                              alt="Planta"
                            />
                            <div className={`regador-wrapper ${regando ? '' : 'parado'}`}>
                              <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
                                <ellipse cx="22" cy="32" rx="14" ry="10" fill="#b0b8c1" stroke="#7a8a99" strokeWidth="2"/>
                                <rect x="34" y="28" width="14" height="6" rx="3" fill="#b0b8c1" stroke="#7a8a99" strokeWidth="2"/>
                                <path d="M22 22 Q22 14 30 12" stroke="#7a8a99" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                                <circle cx="22" cy="42" r="3" fill="#7a8a99"/>
                                <circle cx="30" cy="42" r="3" fill="#7a8a99"/>
                              </svg>
                              {regando && (
                                <>
                                  <div className="gota" />
                                  <div className="gota" />
                                  <div className="gota" />
                                </>
                              )}
                            </div>
                          </div>
                          <div className={`arvore-label ${treeData?.morta ? 'arvore-morta' : 'arvore-viva'}`}>
                            {treeLabel()}
                          </div>
                          {treeData?.morta && (
                            <div style={{ color: '#ff6b6b', fontSize: '0.82rem', fontWeight: 600 }}>
                              Sua árvore morreu. Inicie um novo foco para plantar uma nova.
                            </div>
                          )}
                          <div className="arvore-stats">
                            <span>Focos completos: <span className="valor">{treeData?.focosCompletos ?? 0}</span></span>
                            <span>Pontos: <span className="valor">{progresso?.pontos ?? 0}</span></span>
                            <span>🍅 Tomates: <span className="valor">{progresso?.tomates ?? 0}</span></span>
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