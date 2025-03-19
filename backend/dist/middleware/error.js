"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitHandler = exports.notFoundHandler = exports.catchAsync = exports.errorHandler = exports.handleJWTExpiredError = exports.handleJWTError = exports.handleDuplicateKeyError = exports.handleValidationError = exports.APIError = void 0;
const logger_1 = require("../utils/logger");
// Custom error class for API errors
class APIError extends Error {
    constructor(statusCode, message, isOperational = true, details) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;
        Object.setPrototypeOf(this, APIError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.APIError = APIError;
// Error handler for validation errors
const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new APIError(400, message);
};
exports.handleValidationError = handleValidationError;
// Error handler for duplicate key errors
const handleDuplicateKeyError = (err) => {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value: ${field}. Please use another value`;
    return new APIError(400, message);
};
exports.handleDuplicateKeyError = handleDuplicateKeyError;
// Error handler for JWT errors
const handleJWTError = () => new APIError(401, 'Invalid token. Please log in again.');
exports.handleJWTError = handleJWTError;
// Error handler for JWT expired errors
const handleJWTExpiredError = () => new APIError(401, 'Your token has expired. Please log in again.');
exports.handleJWTExpiredError = handleJWTExpiredError;
// Global error handling middleware
const errorHandler = (err, req, res, next) => {
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
    }
    else if (err.name === 'ValidationError') {
        const validationError = (0, exports.handleValidationError)(err);
        statusCode = validationError.statusCode;
        message = validationError.message;
        isOperational = true;
    }
    else if (err.name === 'MongoError' && err.code === 11000) {
        const duplicateError = (0, exports.handleDuplicateKeyError)(err);
        statusCode = duplicateError.statusCode;
        message = duplicateError.message;
        isOperational = true;
    }
    else if (err.name === 'JsonWebTokenError') {
        const jwtError = (0, exports.handleJWTError)();
        statusCode = jwtError.statusCode;
        message = jwtError.message;
        isOperational = true;
    }
    else if (err.name === 'TokenExpiredError') {
        const tokenError = (0, exports.handleJWTExpiredError)();
        statusCode = tokenError.statusCode;
        message = tokenError.message;
        isOperational = true;
    }
    // Log error
    if (isOperational) {
        logger_1.logger.warn(`Operational error: ${message}`, {
            statusCode,
            path: req.path,
            method: req.method,
            details
        });
    }
    else {
        logger_1.logger.error(`Unhandled error: ${err.message}`, {
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
exports.errorHandler = errorHandler;
// Catch async errors
const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.catchAsync = catchAsync;
// Not found error handler
const notFoundHandler = (req, res, next) => {
    const err = new APIError(404, `Cannot find ${req.method} ${req.originalUrl} on this server`);
    next(err);
};
exports.notFoundHandler = notFoundHandler;
// Rate limit error handler
const rateLimitHandler = (req, res) => {
    const err = new APIError(429, 'Too many requests from this IP, please try again later');
    logger_1.logger.warn(`Rate limit exceeded for IP ${req.ip}`, {
        path: req.path,
        method: req.method
    });
    res.status(err.statusCode).json({
        status: 'error',
        message: err.message
    });
};
exports.rateLimitHandler = rateLimitHandler;
