import React, { useState, useEffect } from 'react';

export default function Pomodoro() {
  const [minutos, setMinutos] = useState(25);
  const [segundos, setSegundos] = useState(0);
  const [ativo, setAtivo] = useState(false);

  useEffect(() => {
    let intervalo = null;

    if (ativo) {
      intervalo = setInterval(() => {
        if (segundos > 0) {
          setSegundos(segundos - 1);
        } else if (segundos === 0) {
          if (minutos === 0) {
            // O tempo acabou! Envia os pontos para o Backend Java
            clearInterval(intervalo);
            setAtivo(false);
            salvarPontosNoBackend();
            alert('Parabéns! Ciclo concluído. Você ganhou 10 maçãs! 🍎');
            setMinutos(25);
            setSegundos(0);
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
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Tempo de Foco 🍅</h1>
      
      <div style={{ fontSize: '6rem', fontWeight: 'bold', margin: '20px 0', fontFamily: 'monospace' }}>
        {String(minutos).padStart(2, '0')}:{String(segundos).padStart(2, '0')}
      </div>

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
        {ativo ? 'Pausar' : 'Iniciar Foco'}
      </button>
    </div>
  );
}
