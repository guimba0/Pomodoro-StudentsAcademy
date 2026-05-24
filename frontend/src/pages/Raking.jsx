import React, { useState, useEffect } from 'react';

export default function Ranking() {
    const [usuarios, setUsuarios] = useState([]);
    const [erro, setErro] = useState('');

    useEffect(() => {
        // Busca a lista dos top 10 usuários direto do Java
        fetch('http://localhost:8080/api/ranking')
            .then(response => {
                if (!response.ok) throw new Error('Erro ao carregar o ranking');
                return response.json();
            })
            .then(data => setUsuarios(data))
            .catch(err => setErro('Não foi possível carregar a classificação no momento.'));
    }, []);

    return (
        <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', color: 'white', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>🏆 Ranking dos Estudantes</h2>
            <p style={{ marginBottom: '30px' }}>Veja quem acumulou mais maçãs de foco! 🍎</p>

            {erro ? (
                <p style={{ color: '#ff6b6b' }}>{erro}</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '10px', overflow: 'hidden' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'rgba(0,0,0,0.4)', height: '50px' }}>
                            <th style={{ padding: '10px' }}>Posição</th>
                            <th style={{ padding: '10px' }}>Nome</th>
                            <th style={{ padding: '10px' }}>Maçãs 🍎</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((user, index) => (
                            <tr key={user.id} style={{ height: '45px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <td style={{ fontWeight: 'bold' }}>{index + 1}º</td>
                                <td>{user.nome}</td>
                                <td style={{ color: '#4caf50', fontWeight: 'bold' }}>{user.pontos}</td>
                            </tr>
                        ))}
                        {usuarios.length === 0 && (
                            <tr>
                                <td colSpan="3" style={{ padding: '20px' }}>Nenhum estudante no ranking ainda.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}
