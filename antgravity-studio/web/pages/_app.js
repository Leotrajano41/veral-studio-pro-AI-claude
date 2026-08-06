import Head from 'next/head';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>AntGravity Studio</title>
        <meta name="description" content="Crie vídeos virais com IA em segundos — pipeline automático de roteiros, voz, mídia e renderização." />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
