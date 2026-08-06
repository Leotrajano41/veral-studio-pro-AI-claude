import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-bg-primary dark">
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { background: '#1a1a1a', color: '#fff', border: '1px solid #404040', borderRadius: '8px' },
        }}
      />
      <Header />
      <Sidebar />
      <main className="pt-16 lg:pl-60 min-h-screen flex flex-col">
        <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
        <Footer />
      </main>
    </div>
  );
}
