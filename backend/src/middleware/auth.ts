import { Request, Response, NextFunction } from 'express';
import { oktaJwtVerifier, hasPermission, isRouteAllowed, getCachedUserRole, cacheUserRole } from '../config/auth';
import { User, UserRole } from '../models/User';
import { Feedback } from '../models/Feedback';
import { logger } from '../utils/logger';

// Extend Express Request type to include user information
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        oktaId: string;
      };
    }
  }
}

// Middleware to verify Okta JWT token
export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }

    const match = authHeader.match(/^Bearer (.+)$/);
    if (!match) {
      return res.status(401).json({ error: 'Invalid authorization header format' });
    }

    try {
      const jwt = match[1];
      const { claims } = await oktaJwtVerifier.verifyAccessToken(jwt, 'api://default');
      
      // Get user from database or create if first time
      const oktaId = claims.sub;
      let user = await User.findOne({ oktaId });
      
      if (!user) {
        // For first-time users, create account with default employee role
        user = await User.create({
          oktaId,
          email: claims.email,
          firstName: claims.given_name,
          lastName: claims.family_name,
          role: UserRole.EMPLOYEE
        });
        logger.info(`Created new user account for ${claims.email}`);
      }

      // Cache the user's role
      cacheUserRole(user.id, user.role);

      // Add user info to request
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        oktaId: user.oktaId
      };

      next();
    } catch (err) {
      logger.error('Token validation failed:', err);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(500).json({ error: 'Internal server error during authentication' });
  }
};

// Middleware to handle anonymous access
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      // Allow anonymous access
      return next();
    }

    // If authorization header exists, verify it
    return authenticateJWT(req, res, next);
  } catch (error) {
    logger.error('Optional authentication error:', error);
    return res.status(500).json({ error: 'Internal server error during authentication' });
  }
};

// Middleware to check role-based permissions
export const requirePermission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const userRole = getCachedUserRole(req.user.id) || req.user.role;

      if (!hasPermission(userRole, permission)) {
        logger.warn(`Permission denied: ${req.user.email} attempted to access ${permission}`);
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      next();
    } catch (error) {
      logger.error('Permission check error:', error);
      return res.status(500).json({ error: 'Internal server error during permission check' });
    }
  };
};

// Middleware to check route access based on role
export const requireRouteAccess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userRole = getCachedUserRole(req.user.id) || req.user.role;

    if (!isRouteAllowed(userRole, req.path)) {
      logger.warn(`Route access denied: ${req.user.email} attempted to access ${req.path}`);
      return res.status(403).json({ error: 'Route access denied' });
    }

    next();
  } catch (error) {
    logger.error('Route access check error:', error);
    return res.status(500).json({ error: 'Internal server error during route access check' });
  }
};

// Middleware to ensure user can only access their own resources
export const requireOwnership = (resourceField: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const resourceId = req.params[resourceField];
      const userRole = getCachedUserRole(req.user.id) || req.user.role;

      // Admins and leaders can access all resources
      if ([UserRole.ADMIN, UserRole.LEADER].includes(userRole as UserRole)) {
        return next();
      }

      // For employees, check resource ownership
      const resource = await Feedback.findById(resourceId);
      if (!resource) {
        return res.status(404).json({ error: 'Resource not found' });
      }

      if (resource.submitter?.toString() !== req.user.id && !resource.isAnonymous) {
        logger.warn(`Ownership check failed: ${req.user.email} attempted to access resource ${resourceId}`);
        return res.status(403).json({ error: 'Access denied' });
      }

      next();
    } catch (error) {
      logger.error('Ownership check error:', error);
      return res.status(500).json({ error: 'Internal server error during ownership check' });
    }
  };
};
