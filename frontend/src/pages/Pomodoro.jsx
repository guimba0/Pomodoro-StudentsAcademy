import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { apiFetch } from '../api/api'
import useTitle from '../hooks/useTitle'

export default function Pomodoro() {
  useTitle('Timer Pomodoro')
  const { user } = useAuth()

  const [minutos, setMinutos] = useState(0)
  const [segundos, setSegundos] = useState(5)
  const [ativo, setAtivo] = useState(false)
  const [iniciado, setIniciado] = useState(false)
  const [ciclosCompletos, setCiclosCompletos] = useState(0)
  const [modoAtual, setModoAtual] = useState('foco')
  const TOTAL_CICLOS = 4

  const tocarSom = useCallback(() => {
    const contexto = new (window.AudioContext || window.webkitAudioContext)()
    const oscilador = contexto.createOscillator()
    const ganho = contexto.createGain()
    oscilador.connect(ganho)
    ganho.connect(contexto.destination)
    oscilador.type = 'sine'
    oscilador.frequency.setValueAtTime(880, contexto.currentTime)
    ganho.gain.setValueAtTime(0.5, contexto.currentTime)
    ganho.gain.exponentialRampToValueAtTime(0.001, contexto.currentTime + 0.8)
    oscilador.start(contexto.currentTime)
    oscilador.stop(contexto.currentTime + 0.8)
  }, [])

  const proximoModo = (ciclos) =>
    ciclos % TOTAL_CICLOS === 0 ? 'pausaLonga' : 'pausaCurta'

  const tempoDoModo = (modo) => {
    if (modo === 'foco') return { minutos: 0, segundos: 5 }
    if (modo === 'pausaCurta') return { minutos: 0, segundos: 3 }
    if (modo === 'pausaLonga') return { minutos: 0, segundos: 2 }
  }

  const labelDoModo = (modo) => {
    if (modo === 'foco') return 'Tempo de Foco 🍅'
    if (modo === 'pausaCurta') return 'Pausa Curta ☕'
    if (modo === 'pausaLonga') return 'Pausa Longa 🌿'
  }

  const reiniciar = () => {
    setAtivo(false)
    setIniciado(false)
    setCiclosCompletos(0)
    setModoAtual('foco')
    const t = tempoDoModo('foco')
    setMinutos(t.minutos)
    setSegundos(t.segundos)
  }

  const salvarPontosNoBackend = useCallback(() => {
    apiFetch('/usuarios/adicionar-pontos', { method: 'POST' })
      .catch(err => console.error('Erro ao salvar pontos:', err))
  }, [])

  // Atualiza o tempo sempre que o modo muda
  useEffect(() => {
    const t = tempoDoModo(modoAtual)
    setMinutos(t.minutos)
    setSegundos(t.segundos)
  }, [modoAtual])

  useEffect(() => {
    if (!ativo) return

    const intervalo = setInterval(() => {
      setSegundos(prev => {
        if (prev > 0) return prev - 1

        // Segundos chegou a 0 — verifica minutos
        setMinutos(prevMin => {
          if (prevMin > 0) return prevMin - 1

          // Fim do ciclo
          clearInterval(intervalo)
          setAtivo(false)
          setIniciado(false)
          tocarSom()

          if (modoAtual === 'foco') {
            setCiclosCompletos(ciclos => {
              const novosCiclos = ciclos + 1
              salvarPontosNoBackend()
              if (novosCiclos % TOTAL_CICLOS === 0) {
                alert(`🎉 Parabéns! Você completou ${TOTAL_CICLOS} ciclos de foco!\nVocê ganhou maçãs e pontos bônus! 🍎✨\nAproveite sua pausa longa, você merece! 🌿`)
              } else {
                alert('Foco concluído! Você ganhou maçãs! 🍎\nHora de uma pausa curta! ☕')
              }
              const proximo = proximoModo(novosCiclos)
              setModoAtual(proximo)
              return novosCiclos
            })
            return 0
          }

          if (modoAtual === 'pausaLonga') {
            alert('💪 Descansou bem? Que tal mais 4 ciclos?\nVocê está indo muito bem! Vamos lá! 🍅')
            setCiclosCompletos(0)
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
  }, [ativo, modoAtual, tocarSom, salvarPontosNoBackend])

  return (
    <div style={{ padding: '60px', color: 'white', textAlign: 'center' }}>
      {user && (
        <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '10px' }}>
          Olá, <strong>{user.nome}</strong>! Bons estudos! 🍅
        </p>
      )}

      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>{labelDoModo(modoAtual)}</h1>

      <div style={{ fontSize: '6rem', fontWeight: 'bold', margin: '20px 0', fontFamily: 'monospace' }}>
        {String(minutos).padStart(2, '0')}:{String(segundos).padStart(2, '0')}
      </div>

      {modoAtual === 'foco' && (
        <>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', margin: '16px 0' }}>
            {Array.from({ length: TOTAL_CICLOS }).map((_, i) => (
              <div
                key={i}
                title={`Ciclo ${i + 1}`}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: i < ciclosCompletos % TOTAL_CICLOS ? '#4caf50' : 'transparent',
                  border: '2px solid',
                  borderColor: i < ciclosCompletos % TOTAL_CICLOS ? '#4caf50' : '#aaa',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>
          <p style={{ fontSize: '0.9rem', color: '#aaa', margin: '0 0 20px' }}>
            {ciclosCompletos % TOTAL_CICLOS}/{TOTAL_CICLOS} ciclos completos
          </p>
        </>
      )}

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
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
    padding: '15px 40px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    backgroundColor: bg,
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  }
}
