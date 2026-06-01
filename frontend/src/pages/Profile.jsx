import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { apiFetch } from '../api/api'
import useTitle from '../hooks/useTitle'

export default function Profile() {
  useTitle('Perfil')

  const { user } = useAuth()
  const [progresso, setProgresso] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [wallpaper, setWallpaper] = useState(null)
  const [avatar, setAvatar] = useState(null)
  const wallpaperRef = useRef()
  const avatarRef = useRef()

  const ofensiva = 7
  const recordeStreak = 12

  const dias = [
    { letra: 'S', ativo: true },
    { letra: 'T', ativo: true },
    { letra: 'Q', ativo: true },
    { letra: 'Q', ativo: true },
    { letra: 'S', ativo: true },
    { letra: 'S', ativo: false },
    { letra: 'D', ativo: false },
  ]

  const wallpaperPresets = [
    { id: 'default', label: 'Padrão', color: '#c5c5c5' },
    { id: 'ceu', label: 'Céu', img: '/img/PomodoroStore/Wallpaper/Ceu_WP.jpg' },
    { id: 'grama', label: 'Grama', img: '/img/PomodoroStore/Wallpaper/Grama_WP.jpg' },
  ]

  const avatarPresets = [
    { id: 'default', label: 'Tomate', img: '/img/ProfilePhoto.png' },
    { id: 'pato', label: 'Pato', img: '/img/PomodoroStore/Icon/Pato_PI.png' },
    { id: 'sapo', label: 'Sapo', img: '/img/PomodoroStore/Icon/Sapo_PI.png' },
    { id: 'vaca', label: 'Vaca', img: '/img/PomodoroStore/Icon/Vaca_PI.png' },
  ]

  async function saveAparencia(wallpaperVal, avatarVal) {
    try {
      const res = await apiFetch('/me/aparencia', {
        method: 'PUT',
        body: JSON.stringify({
          wallpaper: wallpaperVal,
          avatar: avatarVal,
        }),
      })
      if (res?.erro) {
        console.error('[saveAparencia] erro:', res.erro)
      }
      return res
    } catch (err) {
      console.error('[saveAparencia] exceção:', err)
    }
  }

  useEffect(() => {
    apiFetch('/me/aparencia').then(data => {
      if (data && !data.erro) {
        setWallpaper(data.wallpaper ?? null)
        setAvatar(data.avatar ?? null)
      }
    }).catch(err => console.error('[Profile] erro ao carregar aparencia:', err))
  }, [])

  useEffect(() => {
    apiFetch('/pomodoro/progresso').then(data => {
      if (data && !data.erro) {
        setProgresso(data)
      }
    })
  }, [])

  function fileToBase64(file) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.readAsDataURL(file)
    })
  }

  async function handleWallpaperChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const base64 = await fileToBase64(file)
    setWallpaper(base64)
    saveAparencia(base64, avatar)
  }

  async function handleAvatarChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const base64 = await fileToBase64(file)
    setAvatar(base64)
    saveAparencia(wallpaper, base64)
  }

  function selectWallpaper(preset) {
    if (preset.id === 'default') {
      setWallpaper(null)
      saveAparencia(null, avatar)
    } else {
      const path = preset.img
      setWallpaper(path)
      saveAparencia(path, avatar)
    }
  }

  function selectAvatarPreset(preset) {
    if (preset.id === 'default') {
      setAvatar(null)
      saveAparencia(wallpaper, null)
    } else {
      setAvatar(preset.img)
      saveAparencia(wallpaper, preset.img)
    }
  }

  return (
    <main className="perfil2-page">
      <div className="perfil2-card">

        <div
          className="perfil2-banner"
          style={wallpaper ? { backgroundImage: `url(${wallpaper})` } : {}}
        >
          <button className="perfil2-gear-btn" aria-label="Alterar capa e foto" onClick={() => setShowModal(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
          <div className="perfil2-avatar-wrapper" onClick={() => setShowAvatarModal(true)}>
            <img
              className="perfil2-avatar"
              src={avatar || '/img/ProfilePhoto.png'}
              alt="Avatar"
            />
            <div className="perfil2-avatar-overlay">
              <span>Mudar Ícone</span>
            </div>
          </div>
        </div>

        <div className="perfil2-body">

          <div className="perfil2-info">
            <h1 className="perfil2-nome">{user?.nome || 'NOME USUARIO'}</h1>
          </div>

          <div className="perfil2-block perfil2-block-full perfil2-block-streak">
            <div className="perfil2-streak-days">
              {dias.map((dia, i) => (
                <div key={i} className="perfil2-streak-day">
                  {dia.ativo ? (
                    <div className="perfil-day-fire perfil2-streak-fire-mini">
                      <div className="perfil-day-fire-outer" />
                      <div className="perfil-day-fire-inner" />
                    </div>
                  ) : (
                    <div className="perfil2-streak-day-off" />
                  )}
                  <span className="perfil2-streak-day-letter">{dia.letra}</span>
                </div>
              ))}
            </div>
            <div className="perfil2-streak-total">
              <span className="perfil2-block-value">{ofensiva}</span>
              <span className="perfil2-streak-label">dias</span>
            </div>
            <div className="perfil2-streak-fire-wrap">
              <div className="perfil2-fire-big">
                <div className="perfil2-fire-big-outer" />
                <div className="perfil2-fire-big-inner" />
              </div>
            </div>
          </div>

          <div className="perfil2-block-row">
            <div className="perfil2-block perfil2-block-half perfil2-recorde-block">
              <span className="perfil2-block-label">Recorde Streak</span>
              <div className="perfil2-recorde-value">
                <div className="perfil2-fire-inline">
                  <div className="perfil2-fire-small-outer" />
                  <div className="perfil2-fire-small-inner" />
                </div>
                <span className="perfil2-block-value">{recordeStreak}</span>
              </div>
            </div>
            <div className="perfil2-block perfil2-block-half">
              <span className="perfil2-block-label">Tomates</span>
              <span className="perfil2-block-value">{progresso?.tomates ?? 0}</span>
            </div>
          </div>

          <div className="perfil2-block perfil2-block-full">
            <span className="perfil2-block-label">Árvores</span>
            <span className="perfil2-block-value">{progresso?.focosCompletos ?? 0}</span>
          </div>

        </div>

      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" style={{ maxWidth: 700, textAlign: 'left' }} onClick={e => e.stopPropagation()}>

            <h2 style={{ fontSize: 20, marginBottom: 12 }}>Personalizar Perfil</h2>

            {/* Wallpaper */}
            <div className="perfil2-modal-section">
              <span className="perfil2-modal-label">Wallpaper (capa)</span>
              <div
                className="perfil2-modal-preview"
                style={{ backgroundImage: `url(${wallpaper || '/img/ProfilePhoto.png'})` }}
              />

              <span className="perfil2-modal-upload-label">Pré-definidos</span>
              <div className="perfil2-preset-grid">
                {wallpaperPresets.map(p => (
                  <div
                    key={p.id}
                    className={`perfil2-preset-item${wallpaper === null && p.id === 'default' || p.img && wallpaper === p.img ? ' active' : ''}`}
                    onClick={() => selectWallpaper(p)}
                  >
                    <div className="perfil2-preset-thumb" style={p.img ? { backgroundImage: `url(${p.img})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: p.color }} />
                    <span>{p.label}</span>
                  </div>
                ))}
              </div>

              <hr className="perfil2-modal-divider" />

              <span className="perfil2-modal-upload-label">Upload personalizado</span>
              <div className="perfil2-modal-actions">
                <button className="modal-btn modal-btn-cancel" style={{ padding: '6px 16px', fontSize: 13 }} onClick={() => wallpaperRef.current.click()}>
                  Escolher imagem
                </button>
                {wallpaper && wallpaper.startsWith('data:') && (
                  <button className="modal-btn modal-btn-cancel" style={{ padding: '6px 16px', fontSize: 13 }} onClick={() => { setWallpaper(null); saveAparencia(null, avatar) }}>
                    Remover
                  </button>
                )}
              </div>
              <input ref={wallpaperRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleWallpaperChange} />
            </div>

            <button className="modal-btn modal-btn-confirm" style={{ width: '100%', marginTop: 0, padding: '8px', fontSize: 15 }} onClick={() => setShowModal(false)}>
              Fechar
            </button>

          </div>
        </div>
      )}

      {showAvatarModal && (
        <div className="modal-overlay" onClick={() => setShowAvatarModal(false)}>
          <div className="modal-card" style={{ maxWidth: 520, textAlign: 'left' }} onClick={e => e.stopPropagation()}>

            <h2 style={{ fontSize: 20, marginBottom: 12 }}>Ícone de Perfil</h2>

            <div className="perfil2-modal-section">
              <img
                className="perfil2-modal-avatar-preview"
                src={avatar || '/img/ProfilePhoto.png'}
                alt="Preview"
              />

              <span className="perfil2-modal-upload-label">Pré-definidos</span>
              <div className="perfil2-preset-grid">
                {avatarPresets.map(p => (
                  <div
                    key={p.id}
                    className={`perfil2-preset-item${avatar === null && p.id === 'default' || p.img && avatar === p.img ? ' active' : ''}`}
                    onClick={() => selectAvatarPreset(p)}
                  >
                    {p.img ? (
                      <img className="perfil2-preset-avatar" src={p.img} alt={p.label} />
                    ) : (
                      <div className="perfil2-preset-avatar" style={{ background: p.color }} />
                    )}
                    <span>{p.label}</span>
                  </div>
                ))}
              </div>

              <hr className="perfil2-modal-divider" />

              <span className="perfil2-modal-upload-label">Upload personalizado</span>
              <div className="perfil2-modal-actions">
                <button className="modal-btn modal-btn-cancel" style={{ padding: '6px 16px', fontSize: 13 }} onClick={() => avatarRef.current.click()}>
                  Escolher imagem
                </button>
                {avatar && avatar.startsWith('data:') && (
                  <button className="modal-btn modal-btn-cancel" style={{ padding: '6px 16px', fontSize: 13 }} onClick={() => { setAvatar(null); saveAparencia(wallpaper, null) }}>
                    Remover
                  </button>
                )}
              </div>
              <input ref={avatarRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
            </div>

            <button className="modal-btn modal-btn-confirm" style={{ width: '100%', marginTop: 0, padding: '8px', fontSize: 15 }} onClick={() => setShowAvatarModal(false)}>
              Fechar
            </button>

          </div>
        </div>
      )}
    </main>
  )
}
