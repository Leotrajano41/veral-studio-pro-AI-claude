import Head from 'next/head';
import { StoreProvider } from '../lib/store';
import { ToastContainer } from '../components/shared/Toast';
import SetupWizard from '../components/wizard/SetupWizard';
import useWizard from '../hooks/useWizard';
import '../styles/globals.css';

function WizardLayer() {
  const wizard = useWizard();
  return <SetupWizard {...wizard} />;
}

export default function App({ Component, pageProps }) {
  return (
    <StoreProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <title>AntGravity Studio — Viral Studio Pro AI</title>
        <meta name="description" content="Plataforma profissional para produção automatizada de vídeos virais, VSLs, Shorts e Reels com IA." />
      </Head>
      <ToastContainer />
      <WizardLayer />
      <Component {...pageProps} />
    </StoreProvider>
  );
}

