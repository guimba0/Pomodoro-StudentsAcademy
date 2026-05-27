import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fazerCadastro } from '../api/api'
import { validarEmail } from '../utils/validation'

import useTitle from '../hooks/useTitle'

// 1. Pagina de cadastro de novo usuario
export default function Register() {
  useTitle('Cadastrar')

  // 2. Estados do formulario
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // 3. Envia formulario de cadastro
  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setSucesso('')

    // 4. Valida email
    if (!validarEmail(email)) {
      setErro('Insira um email válido.')
      return
    }
    setLoading(true)

    // 5. Chama API de cadastro
    try {
      const data = await fazerCadastro(nome, email, senha)
      if (data.erro) {
        setErro(data.erro)
      } else {
        setSucesso('Conta criada! Redirecionando para login...')
        setTimeout(() => navigate('/login'), 1500)
      }
    } catch {
      setErro('Erro de conexão com o servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Cadastrar</h1>
        {erro && <div className="auth-error">{erro}</div>}
        {sucesso && <div className="auth-success">{sucesso}</div>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="nome">Nome</label>
          <input id="nome" type="text" placeholder="Seu nome" required value={nome} onChange={e => setNome(e.target.value)} />

          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="seu@email.com" required value={email} onChange={e => setEmail(e.target.value)} />

          <label htmlFor="senha">Senha</label>
          <input id="senha" type="password" placeholder="Crie uma senha" required value={senha} onChange={e => setSenha(e.target.value)} />

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        <p className="auth-link">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </main>
  )
}
