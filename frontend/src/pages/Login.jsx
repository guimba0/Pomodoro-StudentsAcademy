import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fazerLogin } from '../api/api'
import { useAuth } from '../contexts/AuthContext'
import { validarEmail } from '../utils/validation'

import useTitle from '../hooks/useTitle'

export default function Login() {
  useTitle('Entrar')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validarEmail(email)) {
      setErro('Insira um email válido.')
      return
    }
    setErro('')
    setLoading(true)
    const data = await fazerLogin(email, senha)
    if (data.logado) {
      setUser({ nome: data.nome, email: data.email || email })
      navigate('/')
    } else {
      setLoading(false)
      setErro(data.erro || 'Email ou senha incorretos.')
    }
  }

  return (
    <main className="hero hero-login">
      <div className="hero-text">
        <h1 className="hero-title">Pomodoro</h1>
        <p className="hero-tagline">Foque. Descanse. Conquiste.</p>
        <p className="hero-description">
          O <strong>Árvore do Foco</strong> une o método Pomodoro com gamificação.
          Enquanto você estuda, sua árvore cresce.
        </p>
      </div>

      <div className="auth-card" style={{ margin: 0 }}>
        <h1 style={{ fontSize: 32 }}>Entrar</h1>
        {erro && <div className="auth-error">{erro}</div>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="seu@email.com" required value={email} onChange={e => setEmail(e.target.value)} />

          <label htmlFor="senha">Senha</label>
          <input id="senha" type="password" placeholder="Sua senha" required value={senha} onChange={e => setSenha(e.target.value)} />

          <p className="auth-link" style={{ marginTop: -12, marginBottom: 16, textAlign: 'right' }}>
            <Link to="/esqueci-senha" style={{ opacity: 0.7, fontSize: 14 }}>Esqueci a senha</Link>
          </p>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="auth-link">
          Não tem conta? <Link to="/cadastro">Cadastrar-se</Link>
        </p>
      </div>
    </main>
  )
}
