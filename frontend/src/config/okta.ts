import { OktaAuth } from '@okta/okta-auth-js';

const oktaAuth = new OktaAuth({
  issuer: import.meta.env.VITE_OKTA_ISSUER,
  clientId: import.meta.env.VITE_OKTA_CLIENT_ID,
  redirectUri: window.location.origin + '/login/callback',
  scopes: ['openid', 'profile', 'email'],
  pkce: true
});

export const oktaConfig = {
  oktaAuth,
  onAuthRequired: () => {
    window.location.pathname = '/login';
  },
  restoreOriginalUri: async (_oktaAuth: unknown, originalUri: string) => {
    window.location.replace(originalUri || window.location.origin);
  }
};
