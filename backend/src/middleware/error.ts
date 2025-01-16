import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// Custom error class for API errors
export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true,
    public details?: any
  ) {
    super(message);
    Object.setPrototypeOf(this, APIError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler for validation errors
export const handleValidationError = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new APIError(400, message);
};

// Error handler for duplicate key errors
export const handleDuplicateKeyError = (err: any) => {
  const field = Object.keys(err.keyValue)[0];
  const message = `Duplicate field value: ${field}. Please use another value`;
  return new APIError(400, message);
};

// Error handler for JWT errors
export const handleJWTError = () =>
  new APIError(401, 'Invalid token. Please log in again.');

// Error handler for JWT expired errors
export const handleJWTExpiredError = () =>
  new APIError(401, 'Your token has expired. Please log in again.');

// Global error handling middleware
export const errorHandler = (
  err: Error | APIError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default error values
  let statusCode = 500;
  let message = 'Internal server error';
  let isOperational = false;
  let details = undefined;

  // Handle known error types
  if (err instanceof APIError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
    details = err.details;
  } else if (err.name === 'ValidationError') {
    const validationError = handleValidationError(err);
    statusCode = validationError.statusCode;
    message = validationError.message;
    isOperational = true;
  } else if (err.name === 'MongoError' && (err as any).code === 11000) {
    const duplicateError = handleDuplicateKeyError(err);
    statusCode = duplicateError.statusCode;
    message = duplicateError.message;
    isOperational = true;
  } else if (err.name === 'JsonWebTokenError') {
    const jwtError = handleJWTError();
    statusCode = jwtError.statusCode;
    message = jwtError.message;
    isOperational = true;
  } else if (err.name === 'TokenExpiredError') {
    const tokenError = handleJWTExpiredError();
    statusCode = tokenError.statusCode;
    message = tokenError.message;
    isOperational = true;
  }

  // Log error
  if (isOperational) {
    logger.warn(`Operational error: ${message}`, {
      statusCode,
      path: req.path,
      method: req.method,
      details
    });
  } else {
    logger.error(`Unhandled error: ${err.message}`, {
      error: err,
      stack: err.stack,
      path: req.path,
      method: req.method
    });
  }

  // Send error response
  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details
    })
  });
};

// Catch async errors
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Not found error handler
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const err = new APIError(404, `Cannot find ${req.method} ${req.originalUrl} on this server`);
  next(err);
};

// Rate limit error handler
export const rateLimitHandler = (req: Request, res: Response) => {
  const err = new APIError(429, 'Too many requests from this IP, please try again later');
  logger.warn(`Rate limit exceeded for IP ${req.ip}`, {
    path: req.path,
    method: req.method
  });
  res.status(err.statusCode).json({
    status: 'error',
    message: err.message
  });
};
