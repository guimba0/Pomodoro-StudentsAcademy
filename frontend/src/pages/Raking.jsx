import React, { useState, useEffect } from 'react';

export default function Ranking() {
  const [usuarios, setUsuarios] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    // Busca a lista dos top 10 usuários direto do Java
    fetch('http://localhost:8080/api/ranking')
      .then(res => {
        if (!res.ok) throw new Error('Erro ao carregar o ranking');
        return res.json();
      })
      .then(data => setUsuarios(data))
      .catch(err => {
        console.error('Erro ao buscar ranking:', err);
        setErro('Não foi possível carregar a classificação.');
      });
  }, []);

  return (
    <div style={{ padding: '40px', color: 'white', textAlign: 'center' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>🏆 Ranking de Maçãs</h2>
      <p style={{ marginBottom: '30px' }}>Veja quem acumulou mais foco! 🍎</p>
      
      {erro ? (
        <p style={{ color: '#ff6b6b' }}>{erro}</p>
      ) : (
        <div style={{ maxWidth: '500px', margin: '0 auto', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid white', height: '40px' }}>
                <th>Posição</th>
                <th>Nome</th>
                <th>Pontos 🍎</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((user, index) => (
                <tr key={user.id} style={{ height: '40px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <td style={{ fontWeight: 'bold' }}>{index + 1}º</td>
                  {/* Lê user.name mapeado no banco de dados do Java */}
                  <td>{user.name || user.nome || 'Estudante'}</td>
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
        </div>
      )}
    </div>
  );
}
