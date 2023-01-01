if (typeof window !== 'undefined') {
  // @ts-ignore
  window._frameTimestamp = null;
}
import 'raf/polyfill';
import 'babel-polyfill';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { trpcNext } from '../lib/trpc';

const App = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

export default trpcNext.withTRPC(App);
