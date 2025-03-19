"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
// Mock user roles for development
const MOCK_USERS = {
    'mock-employee': { id: 'mock-employee', email: 'employee@example.com', role: 'employee' },
    'mock-leader': { id: 'mock-leader', email: 'leader@example.com', role: 'leader' },
    'mock-admin': { id: 'mock-admin', email: 'admin@example.com', role: 'admin' }
};
const authenticate = async (req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        // For development, use mock authentication
        const mockUserId = req.headers['x-mock-user'] || 'mock-employee';
        req.user = MOCK_USERS[mockUserId];
        return next();
    }
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'No authorization header' });
    }
    try {
        // TODO: Replace with actual Okta JWT verification in production
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Invalid token format' });
        }
        // Mock token verification
        req.user = MOCK_USERS['mock-employee'];
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
exports.authenticate = authenticate;
const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (roles.includes(req.user.role)) {
            next();
        }
        else {
            res.status(403).json({ message: 'Forbidden' });
        }
    };
};
exports.authorize = authorize;
