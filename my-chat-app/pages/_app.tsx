import { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useState } from 'react';
import '../styles/globals.css';

function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default App;
