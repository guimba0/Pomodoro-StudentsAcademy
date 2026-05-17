import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { fazerLogout } from '../api/api'
import ConfirmModal from './ConfirmModal'
import { memo } from 'react'

// 1. Barra de navegacao principal (visitante vs logado)
function Navbar() {
  // 2. Estados: usuario, dropdown, modal de logout
  const { user, setUser } = useAuth()
  const [open, setOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  // 3. Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  // 4. Executa logout: fecha modal, chama API, limpa contexto, redireciona
  function handleLogout() {
    setShowLogoutModal(false)
    setOpen(false)
    fazerLogout().then(() => {
      setUser(null)
      navigate('/')
    })
  }

  // 5. Renderizacao condicional: guest vs logado
  return (
    <header className={user ? 'navbar-logged-in' : 'navbar-guest'} role="banner">
      <Link to="/" className="nav-home" aria-label="Página inicial">
        <img className="nav-icon" src="/img/tomate.webp" alt="" aria-hidden="true" />
        <span className="nav-brand">Pomodoro</span>
      </Link>
      <nav className="nav-links" aria-label="Navegação principal">
        <Link to="/pomodoro">Timer</Link>
        <Link to="#">Ranking</Link>
        <Link to="/guia">Guia</Link>
      </nav>

      {user ? (
        <div className="nav-profile-wrapper" ref={dropdownRef}>
          <button className="nav-profile-btn" aria-label="Menu do utilizador" onClick={() => setOpen(!open)}>
            <img className="nav-profile" src="/img/ProfilePhoto.png" alt="" />
          </button>
          <ul className={`nav-dropdown${open ? ' open' : ''}`}>
            <li><Link to="/perfil" onClick={() => setOpen(false)}>Perfil</Link></li>
            <li><Link to="/configuracoes" onClick={() => setOpen(false)}>Configurações</Link></li>
            <li className="nav-dropdown-divider" role="separator"></li>
            <li><button onClick={() => { setOpen(false); setShowLogoutModal(true) }}>Sair</button></li>
          </ul>
          <ConfirmModal
            open={showLogoutModal}
            title="Sair"
            message="Tem certeza que deseja sair?"
            onConfirm={handleLogout}
            onCancel={() => setShowLogoutModal(false)}
          />
        </div>
      ) : (
        <>
          <Link to="/cadastro" className="nav-link-cadastro">Cadastrar-se</Link>
          <Link to="/login" className="nav-btn-entrar">Entrar</Link>
        </>
      )}
    </header>
  )
}

export default memo(Navbar)
