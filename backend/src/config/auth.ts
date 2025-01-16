import OktaJwtVerifier from '@okta/jwt-verifier';
import { logger } from '../utils/logger';

if (!process.env.OKTA_ORG_URL || !process.env.OKTA_CLIENT_ID) {
  logger.error('Missing required environment variables for Okta configuration');
  process.exit(1);
}

export const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: `${process.env.OKTA_ORG_URL}/oauth2/default`,
  clientId: process.env.OKTA_CLIENT_ID,
  assertClaims: {
    'cid': process.env.OKTA_CLIENT_ID
  }
});

export const OKTA_DOMAIN = process.env.OKTA_ORG_URL?.replace('https://', '');

// Cache for user roles to minimize database queries
const userRoleCache = new Map<string, string>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const cacheUserRole = (userId: string, role: string): void => {
  userRoleCache.set(userId, role);
  setTimeout(() => userRoleCache.delete(userId), CACHE_TTL);
};

export const getCachedUserRole = (userId: string): string | undefined => {
  return userRoleCache.get(userId);
};

// Role-based access control configuration
export const RBAC = {
  ADMIN: {
    allowedRoutes: [
      '/api/users',
      '/api/logs',
      '/api/metrics'
    ],
    permissions: [
      'manage:users',
      'view:logs',
      'view:metrics',
      'view:feedback'
    ]
  },
  LEADER: {
    allowedRoutes: [
      '/api/feedback',
      '/api/metrics'
    ],
    permissions: [
      'manage:feedback',
      'view:metrics',
      'view:feedback',
      'respond:feedback'
    ]
  },
  EMPLOYEE: {
    allowedRoutes: [
      '/api/feedback'
    ],
    permissions: [
      'create:feedback',
      'view:own-feedback',
      'edit:own-feedback',
      'delete:own-feedback'
    ]
  }
};

// Helper function to check if a user has required permissions
export const hasPermission = (userRole: string, requiredPermission: string): boolean => {
  const roleConfig = RBAC[userRole as keyof typeof RBAC];
  return roleConfig?.permissions.includes(requiredPermission) || false;
};

// Helper function to check if a route is allowed for a role
export const isRouteAllowed = (userRole: string, route: string): boolean => {
  const roleConfig = RBAC[userRole as keyof typeof RBAC];
  return roleConfig?.allowedRoutes.some(allowedRoute => 
    route.startsWith(allowedRoute)
  ) || false;
};

export const CORS_OPTIONS = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || ''] 
    : ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = {
  windowMs: Number(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000, // default 15 minutes
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100 // default 100 requests per windowMs
};
