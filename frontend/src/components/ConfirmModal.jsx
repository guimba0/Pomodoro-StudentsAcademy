export default function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null

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
