"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RATE_LIMIT_CONFIG = exports.CORS_OPTIONS = exports.isRouteAllowed = exports.hasPermission = exports.RBAC = exports.getCachedUserRole = exports.cacheUserRole = exports.OKTA_DOMAIN = exports.oktaJwtVerifier = void 0;
const jwt_verifier_1 = __importDefault(require("@okta/jwt-verifier"));
const logger_1 = require("../utils/logger");
if (!process.env.OKTA_ORG_URL || !process.env.OKTA_CLIENT_ID) {
    logger_1.logger.error('Missing required environment variables for Okta configuration');
    process.exit(1);
}
exports.oktaJwtVerifier = new jwt_verifier_1.default({
    issuer: `${process.env.OKTA_ORG_URL}/oauth2/default`,
    clientId: process.env.OKTA_CLIENT_ID,
    assertClaims: {
        'cid': process.env.OKTA_CLIENT_ID
    }
});
exports.OKTA_DOMAIN = process.env.OKTA_ORG_URL?.replace('https://', '');
// Cache for user roles to minimize database queries
const userRoleCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const cacheUserRole = (userId, role) => {
    userRoleCache.set(userId, role);
    setTimeout(() => userRoleCache.delete(userId), CACHE_TTL);
};
exports.cacheUserRole = cacheUserRole;
const getCachedUserRole = (userId) => {
    return userRoleCache.get(userId);
};
exports.getCachedUserRole = getCachedUserRole;
// Role-based access control configuration
exports.RBAC = {
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
const hasPermission = (userRole, requiredPermission) => {
    const roleConfig = exports.RBAC[userRole];
    return roleConfig?.permissions.includes(requiredPermission) || false;
};
exports.hasPermission = hasPermission;
// Helper function to check if a route is allowed for a role
const isRouteAllowed = (userRole, route) => {
    const roleConfig = exports.RBAC[userRole];
    return roleConfig?.allowedRoutes.some(allowedRoute => route.startsWith(allowedRoute)) || false;
};
exports.isRouteAllowed = isRouteAllowed;
exports.CORS_OPTIONS = {
    origin: process.env.NODE_ENV === 'production'
        ? [process.env.FRONTEND_URL || '']
        : ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 24 hours
};
// Rate limiting configuration
exports.RATE_LIMIT_CONFIG = {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000, // default 15 minutes
    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100 // default 100 requests per windowMs
};
