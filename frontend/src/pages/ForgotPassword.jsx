import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleRedefinirSenha = async (e) => {
    e.preventDefault();
    setErro('');
    setMensagem('');

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/api/esqueci-senha', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, senha })
      });

      const resultado = await res.json();

      if (!res.ok) {
        setErro(resultado.erro || 'Não foi possível alterar a senha. Verifique se o e-mail está cadastrado.');
      } else {
        setMensagem(resultado.mensagem || 'Senha alterada com sucesso!');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (catchErr) {
      setErro('Erro de conexão com o servidor Java.');
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto', color: 'white' }}>
      <div style={{ backgroundColor: '#7a1f1d', padding: '30px', borderRadius: '10px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '20px' }}>Redefinir Senha</h2>

        {erro && <div style={{ backgroundColor: '#ff6b6b', padding: '10px', borderRadius: '5px', marginBottom: '15px', fontSize: '0.9rem' }}>{erro}</div>}
        {mensagem && <div style={{ backgroundColor: '#28a745', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>{mensagem}</div>}

        <form onSubmit={handleRedefinirSenha} style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: 'none', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Nova senha</label>
            <input 
              type="password" 
              value={senha} 
              onChange={(e) => setSenha(e.target.value)} 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: 'none', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Confirmar senha</label>
            <input 
              type="password" 
              value={confirmarSenha} 
              onChange={(e) => setConfirmarSenha(e.target.value)} 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: 'none', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}
            />
          </div>

          <button 
            type="submit" 
            style={{ width: '100%', padding: '12px', fontSize: '1.1rem', fontWeight: 'bold', backgroundColor: '#ff3b30', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}
          >
            Redefinir Senha
          </button>
        </form>
      </div>
    </div>
  );
}