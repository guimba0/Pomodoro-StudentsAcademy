// 1. Componente de navegação principal — navbar com links e dropdown do usuário
import { useState, useRef, useEffect, memo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { fazerLogout } from '../api/api'
import ConfirmModal from './ConfirmModal'
import TomatoIcon from './TomatoIcon'

function Navbar() {
  const { user, setUser } = useAuth()
  const [open, setOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  // 2. Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  // 3. Executa logout — limpa token e redireciona
  function handleLogout() {
    setShowLogoutModal(false)
    setOpen(false)
    fazerLogout().then(() => {
      localStorage.removeItem('pomodoro_token')
      localStorage.removeItem('pomodoro_user')
      setUser(null)
      navigate('/')
    })
  }

  return (
    <header className={user ? 'navbar-logged-in' : 'navbar-guest'} role="banner">
      <Link to="/" className="nav-home" aria-label="Página inicial">
        <TomatoIcon className="nav-icon" />
        <span className="nav-brand">Pomodoro</span>
      </Link>

      <nav className="nav-links" aria-label="Navegação principal">
        <Link to="/pomodoro" className="nav-link-guia">Timer</Link>

        {user && (
          <>
            <Link to="/ranking" className="nav-link-guia">Ranking</Link>
            <Link to="/loja" className="nav-link-guia">Loja</Link>
          </>
        )}

        <Link to="/guia" className="nav-link-guia">Guia</Link>
      </nav>

      {user ? (
        // 4. Usuário logado — avatar + dropdown (Perfil, Config, Sair)
        <div className="nav-profile-wrapper" ref={dropdownRef}>
          <button
            className="nav-profile-btn"
            aria-label="Menu do utilizador"
            onClick={() => setOpen(o => !o)}
          >
            <img className="nav-profile" src={user?.avatar || '/img/ProfilePhoto.png'} alt="" />
          </button>
          <ul className={`nav-dropdown${open ? ' open' : ''}`}>
            <li><Link to="/perfil" onClick={() => setOpen(false)}>Perfil</Link></li>
            <li><Link to="/configuracoes" onClick={() => setOpen(false)}>Configurações</Link></li>
            <li className="nav-dropdown-divider" role="separator"></li>
            <li>
              <button onClick={() => { setOpen(false); setShowLogoutModal(true) }}>Sair</button>
            </li>
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
        // 5. Visitante — botões de cadastro e login
        <>
          <Link to="/cadastro" className="nav-link-cadastro">Cadastrar-se</Link>
          <Link to="/login" className="nav-btn-entrar">Entrar</Link>
        </>
      )}
    </header>
  )
}

export default memo(Navbar)
