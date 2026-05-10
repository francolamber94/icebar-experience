import type { AppContext, AppProps } from 'next/app';
import App from 'next/app';
import { LangProvider, detectLangFromRequest, type Lang } from '@/i18n/LangProvider';
import '@/styles/globals.css';

interface MyAppProps extends AppProps {
  initialLang: Lang;
}

export default function MyApp({ Component, pageProps, initialLang }: MyAppProps) {
  return (
    <LangProvider initialLang={initialLang}>
      <Component {...pageProps} />
    </LangProvider>
  );
}

MyApp.getInitialProps = async (ctx: AppContext) => {
  const appProps = await App.getInitialProps(ctx);
  const initialLang = detectLangFromRequest(ctx.ctx.req?.headers as Record<string, string | string[] | undefined> | undefined);
  return { ...appProps, initialLang };
};
