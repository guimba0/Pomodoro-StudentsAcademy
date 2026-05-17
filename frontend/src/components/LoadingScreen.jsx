// 1. Tela de carregamento exibida enquanto uma pagina lazy-loading e baixada
export default function LoadingScreen() {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="perfil-loader">Carregando...</div>
      </div>
    </main>
  )
}
