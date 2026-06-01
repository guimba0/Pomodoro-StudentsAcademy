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
        alert("🎉 Parabéns! Você concluiu sua sessão de foco e ganhou 10 tomates! 🍅");
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
        <div className="timer-legacy-card">
            <h2 className="timer-legacy-display">
                {formatarTempo(segundosRestantes)}
            </h2>

            <div className="timer-legacy-actions">
                <button onClick={() => setAtivo(!ativo)} className={`timer-legacy-btn ${ativo ? 'pausar' : 'iniciar'}`}>
                    {ativo ? 'Pausar' : 'Iniciar'}
                </button>
                <button onClick={() => { setAtivo(false); setSegundosRestantes(TEMPO_INICIAL); }} className="timer-legacy-btn resetar">
                    Resetar
                </button>
            </div>
        </div>
    );
}