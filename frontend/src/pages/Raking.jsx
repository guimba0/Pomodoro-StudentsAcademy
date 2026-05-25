import React, { useState, useEffect } from 'react';

export default function Ranking() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    // Busca a lista dos top 10 usuários direto do Java
    fetch('http://localhost:8080/api/ranking')
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(err => console.error('Erro ao buscar ranking:', err));
  }, []);

  return (
    <div style={{ padding: '40px', color: 'white', textAlign: 'center' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>🏆 Ranking de Maçãs</h2>
      
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
                <td>{index + 1}º</td>
                <td>{user.nome || user.name}</td>
                <td style={{ color: '#4caf50', fontWeight: 'bold' }}>{user.pontos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
