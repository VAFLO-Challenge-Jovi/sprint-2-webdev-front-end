import { useToastState } from '../context/ToastContext.jsx';

const ICONS = { success: '✓', error: '✗', info: 'i', warning: '!' };

export default function ToastContainer() {
  const { toasts, handleToastClick } = useToastState();

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast ${toast.type}${toast.removing ? ' removing' : ''}`}
          role="status"
          onClick={() => handleToastClick(toast.id)}
        >
          <span className="toast-icon" aria-hidden="true">
            {ICONS[toast.type] || ICONS.info}
          </span>
          <span className="toast-msg">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
