import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import App from './App.tsx';
import { SessionUserProvider } from './context/session-user/provider.tsx';
import { TokenUserProvider } from './context/token-user/provider.tsx';
import './index.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TokenUserProvider>
        <SessionUserProvider>
          <App />
        </SessionUserProvider>
      </TokenUserProvider>
    </BrowserRouter>
  </QueryClientProvider>,
);
