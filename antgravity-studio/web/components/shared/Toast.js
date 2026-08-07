import { Toaster, toast as hotToast } from 'react-hot-toast';

export function ToastContainer() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#2a2a2a',
          color: '#ffffff',
          border: '1px solid #444444',
          fontSize: '13px',
          borderRadius: '8px',
          padding: '12px 16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        },
        success: {
          style: {
            border: '1px solid #10B981',
            background: 'rgba(16, 185, 129, 0.1)',
          },
          iconTheme: {
            primary: '#10B981',
            secondary: '#ffffff',
          },
        },
        error: {
          style: {
            border: '1px solid #EF4444',
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#EF4444',
          },
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
  success: (msg) => hotToast.success(`✅ ${msg}`),
  error: (msg) => hotToast.error(`❌ ${msg.startsWith('❌') ? msg.slice(2) : msg}`),
  warning: (msg) => hotToast(`⚠️ ${msg.startsWith('⚠️') ? msg.slice(2) : msg}`, {
    style: {
      border: '1px solid #F59E0B',
      background: 'rgba(245, 158, 11, 0.1)',
      color: '#F59E0B',
    },
    icon: '⚠️',
  }),
  info: (msg) => hotToast(`ℹ️ ${msg}`, {
    style: {
      border: '1px solid #3B82F6',
      background: 'rgba(59, 130, 246, 0.1)',
      color: '#60A5FA',
    },
    icon: 'ℹ️',
  }),
};
