export default function ConfirmModal({ open, title, message, confirmLabel, onConfirm, onCancel }) {
  return (
    <div
      className={`modal-overlay${open ? ' show' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="modal">
        <h3 id="confirm-title">{title}</h3>
        <p>{message}</p>
        <div className="modal-btns">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
