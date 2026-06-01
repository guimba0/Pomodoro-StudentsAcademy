import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { apiFetch } from '../api/api'
import useTitle from '../hooks/useTitle'

// 1. Constantes do timer (duração, ciclos, medidas do SVG)
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

// 2. Página principal do Pomodoro (timer + árvore)
export default function Pomodoro() {
  useTitle('Timer Pomodoro')
  const { user } = useAuth()
  const isAuthed = !!user

  // 3. Estados do timer e gamificação
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
    <div className="pomodoro-page">

      {isAuthed && (
        <div className="pomodoro-tomato-counter">
          <span>🍅</span>
          <span className="pomodoro-tomato-sep">:</span>
          <span className="pomodoro-tomato-count">{tomateCount}</span>
      {animacao && (
        <span className="pomodoro-tomato-anim">
          +{animacao} 🍅
        </span>
      )}
        </div>
      )}

      {recovered && (
        <div className="pomodoro-recovered-badge">
          ↩ Sessão recuperada
        </div>
      )}

      <div className="card-wrapper">
        <div className="timer-card">

          <div className="timer-section">

          <div className="pomodoro-svg-wrapper" style={{ width: `${W}px` }}>
            <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
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
              />
            </svg>
            <div className="pomodoro-timer-text">
              {String(Math.floor(remaining / 60)).padStart(2, '0')}:
              {String(remaining % 60).padStart(2, '0')}
            </div>
          </div>

          <p className="pomodoro-mode-label">
            {labelDoModo(mode)}
          </p>

          <div className="pomodoro-cycle-dots">
            {Array.from({ length: TOTAL_CYCLES }).map((_, i) => (
              <div key={i} className={`pomodoro-cycle-dot${i < cycleCount % TOTAL_CYCLES ? ' active' : ''}`} />
            ))}
          </div>

          <p className="pomodoro-cycle-info">
            {cycleCount % TOTAL_CYCLES}/{TOTAL_CYCLES} ciclos completos
          </p>

          </div>

          <div className="timer-actions">
          <div className="pomodoro-btn-group">

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
              <div className="pomodoro-btn-row">
                <button
                  onClick={() => setStatus((s) => s === 'running' ? 'paused' : 'running')}
                  className={`pomodoro-btn ${status === 'running' ? 'pomodoro-btn-yellow' : 'pomodoro-btn-green'}`}>
                  {status === 'running' ? 'Pausar' : 'Retomar'}
                </button>
                <button
                  onClick={resetTimer}
                  className="pomodoro-btn pomodoro-btn-red">
                  Reiniciar
                </button>
              </div>
            )}

          </div>
          </div>
        </div>

        <button
          className={`botao-arvore${showTreePanel ? ' aberto' : ''}`}
          onClick={() => setShowTreePanel((a) => !a)}
          title={showTreePanel ? 'Fechar árvore' : 'Ver árvore'}
        >
          <span className="botao-arvore-icone">
            ▶
          </span>
        </button>

        <div className={`arvore-painel ${showTreePanel ? 'aberto' : ''}`}>
          {isAuthed ? (
            <div className="arvore-conteudo">
                          <div className="arvore-imagem-container">
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
                                              <img src="/img/regador.png" alt="regador" className="regador-img" />
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
                            <div className="pomodoro-tree-message">
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
            <p className="pomodoro-guest-msg">
              Faça login para ter sua árvore
            </p>
          )}
        </div>
      </div>

      {message && (
        <div className="pomodoro-message-toast">
          <p className="pomodoro-message-text">
            {message}
          </p>
          <div className="pomodoro-msg-actions">
            <button
              onClick={() => { setMessage(''); setRecovered(false) }}
              className="pomodoro-msg-ok-btn">
              OK
            </button>
          </div>
        </div>
      )}

    </div>
  )
}