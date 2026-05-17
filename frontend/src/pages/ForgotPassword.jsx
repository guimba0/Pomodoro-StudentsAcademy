import { useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../api/api'
import useTitle from '../hooks/useTitle'

// 1. Pagina de redefinicao de senha
export default function ForgotPassword() {
  useTitle('Redefinir Senha')

  // 2. Estados do formulario
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [loading, setLoading] = useState(false)

  // 3. Envia formulario de redefinicao
  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setSucesso('')

    // 4. Validacoes
    if (!email.trim()) {
      setErro('Insira seu email.')
      return
    }
    if (senha.length < 3) {
      setErro('A senha deve ter pelo menos 3 caracteres.')
      return
    }
    if (senha !== confirmar) {
      setErro('Senhas não conferem.')
      return
    }

    // 5. Chama API
    setLoading(true)
    const data = await apiFetch('/esqueci-senha', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim(), senha }),
    })

    if (data.logado) {
      setSucesso('Senha redefinida! Redirecionando para o login...')
      setTimeout(() => window.location.href = '/login', 2000)
    } else {
      setLoading(false)
      setErro(data.erro || 'Erro ao redefinir senha.')
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Redefinir Senha</h1>
        {erro && <div className="auth-error">{erro}</div>}
        {sucesso && <div className="auth-success">{sucesso}</div>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="seu@email.com" required value={email} onChange={e => setEmail(e.target.value)} />

          <label htmlFor="senha">Nova senha</label>
          <input id="senha" type="password" placeholder="Nova senha" required value={senha} onChange={e => setSenha(e.target.value)} />

          <label htmlFor="confirmar">Confirmar senha</label>
          <input id="confirmar" type="password" placeholder="Confirme a nova senha" required value={confirmar} onChange={e => setConfirmar(e.target.value)} />

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Redefinindo...' : 'Redefinir Senha'}
          </button>
        </form>

        <p className="auth-link">
          Lembrou? <Link to="/login">Fazer login</Link>
        </p>
      </div>
    </main>
  )
}
