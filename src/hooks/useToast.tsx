import React, { createContext, useContext, useCallback, useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { createPortal } from 'react-dom';

export type ToastType = 'success' | 'error' | 'loading' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

    if (type !== 'loading') {
      setTimeout(() => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
      }, 5000);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {typeof window !== 'undefined' &&
        createPortal(
          <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
              <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
};

interface ToastProps extends Toast {
  onClose: () => void;
}

const Toast = ({ message, type, onClose }: ToastProps) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    loading: <Loader2 className="w-5 h-5 text-primary animate-spin" />,
    info: <AlertCircle className="w-5 h-5 text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-green-500/10',
    error: 'bg-red-500/10',
    loading: 'bg-primary/10',
    info: 'bg-blue-500/10',
  };

  const borderColors = {
    success: 'border-green-500/20',
    error: 'border-red-500/20',
    loading: 'border-primary/20',
    info: 'border-blue-500/20',
  };

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg
        border backdrop-blur-sm
        animate-in slide-in-from-right-full
        ${bgColors[type]}
        ${borderColors[type]}
      `}
      role="alert"
    >
      {icons[type]}
      <p className="text-sm font-medium text-white">{message}</p>
      {type !== 'loading' && (
        <button
          onClick={onClose}
          className="ml-auto text-gray-400 hover:text-white transition-colors"
        >
          <XCircle className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};