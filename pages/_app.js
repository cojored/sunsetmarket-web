import { SessionProvider } from "next-auth/react";
import { SSRProvider } from "@react-aria/ssr";


function MyApp({ Component, pageProps }) {
  return (
    <SSRProvider>
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </SSRProvider>
  );
}

export default MyApp;
