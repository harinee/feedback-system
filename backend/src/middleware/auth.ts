import { Request, Response, NextFunction } from 'express';
import OktaJwtVerifier = require('@okta/jwt-verifier');
import { User, UserRole } from '../models/User';

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: process.env.OKTA_ISSUER!,
  clientId: process.env.OKTA_CLIENT_ID!
});

interface OktaClaims extends OktaJwtVerifier.JwtClaims {
  email: string;
  groups?: string[];
}

// Error class for authentication/authorization failures
export class AuthError extends Error {
  constructor(message: string, public statusCode: number = 401) {
    super(message);
    this.name = 'AuthError';
  }
}

// Middleware to verify JWT token
export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new AuthError('No authorization header');
    }

    const match = authHeader.match(/^Bearer (.+)$/);
    if (!match) {
      throw new AuthError('Invalid authorization header format');
    }

    const token = match[1];
    const { claims } = await oktaJwtVerifier.verifyAccessToken(token, 'api://default');
    const oktaClaims = claims as unknown as OktaClaims;

    if (!oktaClaims.email) {
      throw new AuthError('Email claim missing from token');
    }

    // Find or create user
    let user = await User.findOne({ oktaId: oktaClaims.sub });
    if (!user) {
      // Determine role from Okta groups
      let role = UserRole.Employee; // Default role
      if (oktaClaims.groups) {
        if (oktaClaims.groups.includes('Admin')) {
          role = UserRole.Admin;
        } else if (oktaClaims.groups.includes('Leader')) {
          role = UserRole.Leader;
        }
      }

      user = await User.create({
        email: oktaClaims.email,
        oktaId: oktaClaims.sub,
        role
      });
    }

    // Attach user to request
    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      oktaId: user.oktaId
    };

    next();
  } catch (error) {
    if (error instanceof AuthError) {
      next(error);
    } else {
      next(new AuthError('Authentication failed'));
    }
  }
};

// Optional authentication middleware
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await authenticateJWT(req, res, next);
  } catch {
    // Continue without authentication
    next();
  }
};

// Permission checking middleware factory
export const requirePermission = (permission: string) => {
  const permissionMap = {
    'view:feedback': [UserRole.Admin, UserRole.Leader],
    'view:own-feedback': [UserRole.Employee],
    'manage:feedback': [UserRole.Leader],
    'delete:own-feedback': [UserRole.Employee],
    'respond:feedback': [UserRole.Leader],
    'view:metrics': [UserRole.Admin, UserRole.Leader]
  };

  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AuthError('Authentication required'));
    }

    const allowedRoles = permissionMap[permission as keyof typeof permissionMap];
    if (!allowedRoles) {
      return next(new AuthError('Invalid permission'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AuthError('Insufficient permissions', 403));
    }

    next();
  };
};

// Resource ownership checking middleware factory
export const requireOwnership = (idParam: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AuthError('Authentication required'));
    }

    const resourceId = req.params[idParam];
    if (!resourceId) {
      return next(new AuthError('Resource ID not provided'));
    }

    // For Employee role, check if they own the resource
    if (req.user.role === UserRole.Employee) {
      const feedback = await User.findById(resourceId);
      if (!feedback || feedback.oktaId !== req.user.oktaId) {
        return next(new AuthError('Not authorized to access this resource', 403));
      }
    }

    next();
  };
};
