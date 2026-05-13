import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { apiFetch } from '../api/api'
import { useAuth } from '../contexts/AuthContext'

import useTitle from '../hooks/useTitle'

export default function Settings() {
  useTitle('Configurações')
  const { user, setUser } = useAuth()

  const [nome, setNome] = useState(user?.nome || '')
  const [email, setEmail] = useState(user?.email || '')
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  if (!user) return <Navigate to="/login" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setSucesso('')

    if (!nome.trim() || !email.trim()) {
      setErro('Preencha nome e email.')
      return
    }
    if (senha && senha !== confirmar) {
      setErro('Senhas não conferem.')
      return
    }

    const body = { nome: nome.trim(), email: email.trim() }
    if (senha) body.senha = senha

    const res = await apiFetch('/me', {
      method: 'PUT',
      body: JSON.stringify(body),
    })

    if (res.erro) {
      setErro(res.erro)
      return
    }
    setUser({ nome: nome.trim(), email: email.trim() })
    setSucesso('Dados atualizados com sucesso!')
    setSenha('')
    setConfirmar('')
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Configurações</h1>
        {erro && <div className="auth-error">{erro}</div>}
        {sucesso && <div className="auth-success">{sucesso}</div>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="configNome">Nome</label>
          <input id="configNome" type="text" placeholder="Seu nome" required value={nome} onChange={e => setNome(e.target.value)} />

          <label htmlFor="configEmail">Email</label>
          <input id="configEmail" type="email" placeholder="seu@email.com" required value={email} onChange={e => setEmail(e.target.value)} />

          <label htmlFor="configSenha">
            Nova senha{' '}
            <span style={{ fontWeight: 400, opacity: 0.6 }}>(deixe em branco para manter)</span>
          </label>
          <input id="configSenha" type="password" placeholder="Nova senha" value={senha} onChange={e => setSenha(e.target.value)} />

          <label htmlFor="configConfirmar">Confirmar senha</label>
          <input id="configConfirmar" type="password" placeholder="Confirme a nova senha" value={confirmar} onChange={e => setConfirmar(e.target.value)} />

          <button type="submit" className="auth-btn">Salvar</button>
        </form>

        <p className="auth-link"><Link to="/perfil">Voltar ao perfil</Link></p>
      </div>
    </main>
  )
}
