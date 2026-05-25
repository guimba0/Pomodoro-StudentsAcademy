import React, { useState, useEffect } from 'react';

export default function Timer({ onSessaoConcluida }) {
    const TEMPO_INICIAL = 120; // 120 segundos para teste do M2
    const TOTAL_CICLOS = 4;
    const [segundosRestantes, setSegundosRestantes] = useState(TEMPO_INICIAL);
    const [ativo, setAtivo] = useState(false);
    const [ciclosCompletos, setCiclosCompletos] = useState(0);

    useEffect(() => {
        let intervalo = null;
        if (ativo && segundosRestantes > 0) {
            intervalo = setInterval(() => {
                setSegundosRestantes((tempo) => tempo - 1);
            }, 1000);
        } else if (segundosRestantes === 0 && ativo) {
            setAtivo(false);
            finalizarSessaoFoco();
        }
        return () => clearInterval(intervalo);
    }, [ativo, segundosRestantes]);

    const finalizarSessaoFoco = () => {
        setCiclosCompletos((c) => (c + 1) % (TOTAL_CICLOS + 1));
        alert("🎉 Parabéns! Você concluiu sua sessão de foco e ganhou 10 maçãs! 🍎");

        fetch(`http://localhost:8080/api/usuarios/adicionar-pontos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            if (response.ok && onSessaoConcluida) {
                onSessaoConcluida();
            }
        })
        .catch(error => console.error("Erro ao salvar pontos:", error));
    };

    const formatarTempo = (totalSegundos) => {
        const minutos = Math.floor(totalSegundos / 60);
        const segundos = totalSegundos % 60;
        return `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px', background: '#f9f9f9', borderRadius: '10px', maxWidth: '300px', margin: '20px auto' }}>
            <h2 style={{ fontSize: '3rem', margin: '10px 0', color: '#333' }}>
                {formatarTempo(segundosRestantes)}
            </h2>

            {/* Contador de ciclos */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '12px 0' }}>
                {Array.from({ length: TOTAL_CICLOS }).map((_, i) => (
                    <div
                        key={i}
                        title={`Ciclo ${i + 1}`}
                        style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            backgroundColor: i < ciclosCompletos ? '#4caf50' : 'transparent',
                            border: '2px solid',
                            borderColor: i < ciclosCompletos ? '#4caf50' : '#aaa',
                            transition: 'all 0.3s ease',
                        }}
                    />
                ))}
            </div>
            <p style={{ fontSize: '0.8rem', color: '#888', margin: '0 0 12px' }}>
                {ciclosCompletos}/{TOTAL_CICLOS} ciclos
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={() => setAtivo(!ativo)} style={{ padding: '10px 20px', backgroundColor: ativo ? '#ff9800' : '#4caf50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    {ativo ? 'Pausar' : 'Iniciar'}
                </button>
                <button onClick={() => { setAtivo(false); setSegundosRestantes(TEMPO_INICIAL); }} style={{ padding: '10px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Resetar
                </button>
            </div>
        </div>
    );
}