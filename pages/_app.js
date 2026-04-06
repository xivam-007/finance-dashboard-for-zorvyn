import '../styles/globals.css';
import { FinanceProvider } from '../context/FinanceContext';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }) {
  return (
    <FinanceProvider>
      <Component {...pageProps} />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            borderRadius: '10px',
            boxShadow: 'var(--shadow-lg)',
          },
        }}
      />
    </FinanceProvider>
  );
}
