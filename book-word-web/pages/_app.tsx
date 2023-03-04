import ToastProvider from '@/context/toast-context';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr/_internal';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
      }}
    >
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </SWRConfig>
  );
}
