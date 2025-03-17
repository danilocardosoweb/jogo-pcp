import { Toaster as SonnerToaster } from 'sonner';

export function CustomToaster() {
  return (
    <SonnerToaster
      theme="dark"
      className="pixel-text"
      toastOptions={{
        style: {
          background: '#1a1a1a',
          border: '2px solid #4a5568',
          color: '#ffffff',
          fontSize: '0.875rem',
        },
        success: {
          style: {
            background: '#1a1a1a',
            border: '2px solid #48bb78',
            color: '#ffffff',
          },
        },
        error: {
          style: {
            background: '#1a1a1a',
            border: '2px solid #f56565',
            color: '#ffffff',
          },
        },
        warning: {
          style: {
            background: '#1a1a1a',
            border: '2px solid #ed8936',
            color: '#ffffff',
          },
        },
      }}
    />
  );
}
