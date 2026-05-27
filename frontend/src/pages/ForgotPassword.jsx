import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { redefinirSenhaApi } from '../api/api'
import useTitle from '../hooks/useTitle'

export default function ForgotPassword() {
  useTitle('Redefinir Senha')

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRedefinirSenha = async (e) => {
    e.preventDefault()
    setErro('')
    setMensagem('')

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    setLoading(true)
    const resultado = await redefinirSenhaApi(email, senha)
    setLoading(false)

    if (resultado.erro) {
      setErro(resultado.erro)
      return
    }
    setMensagem(resultado.mensagem || 'Senha alterada com sucesso!')
    setTimeout(() => navigate('/login'), 2000)
  }

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
            disabled={loading}
            style={{ width: '100%', padding: '12px', fontSize: '1.1rem', fontWeight: 'bold', backgroundColor: '#ff3b30', color: 'white', border: 'none', borderRadius: '5px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: '10px' }}
          >
            {loading ? 'Alterando...' : 'Redefinir Senha'}
          </button>
        </form>
      </div>
    </div>
  )
}