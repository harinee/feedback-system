// Mock Okta configuration for development
const oktaAuth = {
  issuer: 'https://dev-mock.okta.com/oauth2/default',
  clientId: 'mock-client-id',
  redirectUri: window.location.origin + '/login/callback',
  scopes: ['openid', 'profile', 'email'],
  pkce: true,
  disableHttpsCheck: import.meta.env.VITE_NODE_ENV === 'development'
};

// Mock authentication functions
const mockAuth = {
  isAuthenticated: true,
  getUser: () => ({
    email: 'employee@example.com',
    role: 'employee',
    sub: 'mock-employee'
  }),
  signInWithRedirect: () => Promise.resolve(),
  handleLoginRedirect: () => Promise.resolve(),
  signOut: () => Promise.resolve()
};

export const oktaConfig = {
  oktaAuth: import.meta.env.VITE_NODE_ENV === 'development' ? mockAuth : oktaAuth,
  onAuthRequired: () => {
    window.location.pathname = '/login';
  },
  restoreOriginalUri: async (_oktaAuth: unknown, originalUri: string) => {
    window.location.replace(originalUri || window.location.origin);
  }
};
