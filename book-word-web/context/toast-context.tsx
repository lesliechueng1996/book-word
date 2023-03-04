import { createContext, ReactNode, useCallback, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';

export const ToastContext = createContext<
  | {
      info: (msg: string) => void;
      warn: (msg: string) => void;
      error: (msg: string) => void;
    }
  | undefined
>(undefined);

export default function ToastProvider({ children }: { children: ReactNode }) {
  const info = useCallback((msg: string) => {
    toast.info(msg, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  }, []);

  const warn = useCallback((msg: string) => {
    toast.warn(msg, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  }, []);

  const error = useCallback((msg: string) => {
    toast.error(msg, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  }, []);

  return (
    <ToastContext.Provider value={{ info, warn, error }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const toastContext = useContext(ToastContext);
  if (!toastContext) {
    throw Error('useToast 需在 ToastProvider 中使用');
  }
  return toastContext;
};
