import { Toaster, toast as hotToast } from 'react-hot-toast';

export function ToastContainer() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          background: '#2a2a2a',
          color: '#ffffff',
          border: '1px solid #444444',
          fontSize: '13px',
          borderRadius: '8px',
          padding: '12px 16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
        },
        success: {
          iconTheme: {
            primary: '#10B981',
            secondary: '#ffffff',
          },
        },
        error: {
          iconTheme: {
            primary: '#EF4444',
            secondary: '#ffffff',
          },
        },
      }}
    />
  );
}

export const notify = {
  success: (msg) => hotToast.success(msg),
  error: (msg) => hotToast.error(msg),
  info: (msg) => hotToast(msg),
};

export default ToastContainer;
