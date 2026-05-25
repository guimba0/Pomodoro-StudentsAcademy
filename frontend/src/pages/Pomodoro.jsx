import React, { useState, useEffect } from 'react';

export default function Pomodoro() {
  const [minutos, setMinutos] = useState(25);
  const [segundos, setSegundos] = useState(0);
  const [ativo, setAtivo] = useState(false);
  const [iniciado, setIniciado] = useState(false);
  const [ciclosCompletos, setCiclosCompletos] = useState(0);
  const [modoAtual, setModoAtual] = useState('foco');
  const TOTAL_CICLOS = 4;

  const tocarSom = () => {
    const contexto = new (window.AudioContext || window.webkitAudioContext)();
    const oscilador = contexto.createOscillator();
    const ganho = contexto.createGain();
    oscilador.connect(ganho);
    ganho.connect(contexto.destination);
    oscilador.type = 'sine';
    oscilador.frequency.setValueAtTime(880, contexto.currentTime);
    ganho.gain.setValueAtTime(0.5, contexto.currentTime);
    ganho.gain.exponentialRampToValueAtTime(0.001, contexto.currentTime + 0.8);
    oscilador.start(contexto.currentTime);
    oscilador.stop(contexto.currentTime + 0.8);
  };

  const proximoModo = (ciclos) => {
    if (ciclos % TOTAL_CICLOS === 0) return 'pausaLonga';
    return 'pausaCurta';
  };

const tempoDoModo = (modo) => {
    if (modo === 'foco') return { minutos: 25, segundos: 0 };
    if (modo === 'pausaCurta') return { minutos: 5, segundos: 0 };
    if (modo === 'pausaLonga') return { minutos: 15, segundos: 0 };
  };

  const labelDoModo = (modo) => {
    if (modo === 'foco') return 'Tempo de Foco 🍅';
    if (modo === 'pausaCurta') return 'Pausa Curta ☕';
    if (modo === 'pausaLonga') return 'Pausa Longa 🌿';
  };

  const reiniciar = () => {
    setAtivo(false);
    setIniciado(false);
    setCiclosCompletos(0);
    setModoAtual('foco');
    setMinutos(tempoDoModo('foco').minutos);
    setSegundos(tempoDoModo('foco').segundos);
  };

  useEffect(() => {
    let intervalo = null;

    if (ativo) {
      intervalo = setInterval(() => {
        if (segundos > 0) {
          setSegundos(segundos - 1);
        } else if (segundos === 0) {
          if (minutos === 0) {
            clearInterval(intervalo);
            setAtivo(false);
            setIniciado(false);
            tocarSom();

            if (modoAtual === 'foco') {
              const novosCiclos = ciclosCompletos + 1;
              setCiclosCompletos(novosCiclos);
              salvarPontosNoBackend();

              if (novosCiclos % TOTAL_CICLOS === 0) {
                alert(`🎉 Parabéns! Você completou ${TOTAL_CICLOS} ciclos de foco!\nVocê ganhou maçãs e pontos bônus! 🍎✨\nAproveite sua pausa longa, você merece! 🌿`);
              } else {
                alert('Foco concluído! Você ganhou maçãs! 🍎\nHora de uma pausa curta! ☕');
              }

              const proximo = proximoModo(novosCiclos);
              const tempo = tempoDoModo(proximo);
              setModoAtual(proximo);
              setMinutos(tempo.minutos);
              setSegundos(tempo.segundos);

            } else if (modoAtual === 'pausaLonga') {
              alert('💪 Descansou bem? Que tal mais 4 ciclos?\nVocê está indo muito bem! Vamos lá! 🍅');
              setCiclosCompletos(0);
              const tempo = tempoDoModo('foco');
              setModoAtual('foco');
              setMinutos(tempo.minutos);
              setSegundos(tempo.segundos);

            } else {
              alert('Pausa concluída! Hora de focar! 🍅');
              const tempo = tempoDoModo('foco');
              setModoAtual('foco');
              setMinutos(tempo.minutos);
              setSegundos(tempo.segundos);
            }
          } else {
            setMinutos(minutos - 1);
            setSegundos(59);
          }
        }
      }, 1000);
    } else {
      clearInterval(intervalo);
    }

    return () => clearInterval(intervalo);
  }, [ativo, minutos, segundos]);

  const salvarPontosNoBackend = () => {
    fetch('http://localhost:8080/api/usuarios/adicionar-pontos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).catch(err => console.error('Erro ao salvar pontos:', err));
  };

  return (
    <div style={{ padding: '60px', color: 'white', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>{labelDoModo(modoAtual)}</h1>

      <div style={{ fontSize: '6rem', fontWeight: 'bold', margin: '20px 0', fontFamily: 'monospace' }}>
        {String(minutos).padStart(2, '0')}:{String(segundos).padStart(2, '0')}
      </div>

      {/* Contador de ciclos */}
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

      {/* Botões */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        {!iniciado ? (
          <button
            onClick={() => { setAtivo(true); setIniciado(true); }}
            style={{
              padding: '15px 40px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {modoAtual === 'foco' ? 'Iniciar Foco' : 'Iniciar Pausa'}
          </button>
        ) : (
          <>
            <button
              onClick={() => setAtivo(!ativo)}
              style={{
                padding: '15px 40px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                backgroundColor: ativo ? '#ffc107' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              {ativo ? 'Pausar' : 'Retomar'}
            </button>
            <button
              onClick={reiniciar}
              style={{
                padding: '15px 40px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Reiniciar
            </button>
          </>
        )}
      </div>
    </div>
  );
}