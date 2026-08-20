import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext(null);

let nextToastId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismissToast = useCallback((id) => {
    setToasts((current) =>
      current.map((toast) => (toast.id === id ? { ...toast, removing: true } : toast)),
    );

    // Matches the .toast.removing / slideOutRight CSS animation duration (0.3s)
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 300);
  }, []);

  const showToast = useCallback(
    (message, type = 'info', duration = 3500) => {
      const id = nextToastId++;
      setToasts((current) => [...current, { id, message, type, removing: false }]);

      const timer = setTimeout(() => dismissToast(id), duration);
      timers.current.set(id, timer);
    },
    [dismissToast],
  );

  const handleToastClick = useCallback(
    (id) => {
      const timer = timers.current.get(id);
      if (timer) clearTimeout(timer);
      dismissToast(id);
    },
    [dismissToast],
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, handleToastClick }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }
  return context.showToast;
}

export function useToastState() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastState deve ser usado dentro de um ToastProvider');
  }
  return context;
}
