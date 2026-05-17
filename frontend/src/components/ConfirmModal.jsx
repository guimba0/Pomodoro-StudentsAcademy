// 1. Modal de confirmacao reutilizavel
export default function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  // 2. Se fechado, nao renderiza nada
  if (!open) return null

  // 3. Fundo escuro fecha ao clicar fora; cartao impede propagacao
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="modal-btn modal-btn-cancel" onClick={onCancel}>Cancelar</button>
          <button className="modal-btn modal-btn-confirm" onClick={onConfirm}>Sair</button>
        </div>
      </div>
    </div>
  )
}
