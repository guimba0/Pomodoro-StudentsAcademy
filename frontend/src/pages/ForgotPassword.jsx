import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { redefinirSenhaApi } from '../api/api'
import useTitle from '../hooks/useTitle'

// 1. Página de redefinição de senha
export default function ForgotPassword() {
  useTitle('Redefinir Senha')

  // 2. Estados do formulário
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // 3. Envia formulário de redefinição
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
    <main className="auth-page forgot-page">
      <div className="auth-card forgot-card">
        <h1>Redefinir Senha</h1>

        {erro && <div className="auth-error">{erro}</div>}
        {mensagem && <div className="auth-success">{mensagem}</div>}

        <form onSubmit={handleRedefinirSenha}>
          <label htmlFor="emailReset">Email</label>
          <input id="emailReset" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label htmlFor="novaSenha">Nova senha</label>
          <input id="novaSenha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />

          <label htmlFor="confirmarSenha">Confirmar senha</label>
          <input id="confirmarSenha" type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} required />

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Alterando...' : 'Redefinir Senha'}
          </button>
        </form>
      </div>
    </main>
  )
}