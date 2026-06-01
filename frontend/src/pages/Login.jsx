import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fazerLogin } from '../api/api'
import { useAuth } from '../contexts/AuthContext'
import { validarEmail } from '../utils/validation'

import useTitle from '../hooks/useTitle'

// 1. Pagina de login
export default function Login() {
  useTitle('Entrar')

  // 2. Estados do formulario
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuth()
  const navigate = useNavigate()

  // 3. Envia formulario de login
  async function handleSubmit(e) {
    e.preventDefault()
    // 4. Valida email antes de enviar
    if (!validarEmail(email)) {
      setErro('Insira um email válido.')
      return
    }
    setErro('')
    setLoading(true)

    // 5. Chama API de login
    try {
      const data = await fazerLogin(email, senha)
      if (data.logado && data.token) {
        setUser({ nome: data.nome, email: data.email || email })
        localStorage.setItem('pomodoro_token', data.token)
        localStorage.setItem('pomodoro_user', JSON.stringify({ nome: data.nome, email: data.email || email }))
        setLoading(false)
        navigate('/')
      } else {
        setLoading(false)
        setErro(data.erro || 'Email ou senha incorretos.')
      }
    } catch {
      setLoading(false)
      setErro('Erro de conexão com o servidor.')
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

      <div className="auth-card login-card">
        <h1 className="login-heading">Entrar</h1>
        {erro && <div className="auth-error">{erro}</div>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="seu@email.com" required value={email} onChange={e => setEmail(e.target.value)} />

          <label htmlFor="senha">Senha</label>
          <input id="senha" type="password" placeholder="Sua senha" required value={senha} onChange={e => setSenha(e.target.value)} />

          <p className="auth-link login-forgot-row">
            <Link to="/esqueci-senha" className="login-forgot-link">Esqueci a senha</Link>
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
