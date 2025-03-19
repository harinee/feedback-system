import React from 'react';

console.log('main.tsx is being loaded');
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import theme from './theme';

// Keeping Okta implementation commented for future use:
/*
import { Security } from '@okta/okta-react';
import { oktaConfig } from './config/okta';
*/

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Okta Security wrapper removed for development */}
      {/* <Security {...oktaConfig}> */}
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </QueryClientProvider>
      {/* </Security> */}
    </BrowserRouter>
  </React.StrictMode>
);
