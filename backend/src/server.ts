import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

import connectDB from './config/database';
import { CORS_OPTIONS, RATE_LIMIT_CONFIG } from './config/auth';
import { logger, stream } from './utils/logger';
import { errorHandler, notFoundHandler, rateLimitHandler } from './middleware/error';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Create Express app
const app = express();

// Connect to MongoDB
connectDB().catch(err => {
  logger.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

// Security middleware
app.use(helmet());
app.use(cors(CORS_OPTIONS));
app.use(rateLimit({
  ...RATE_LIMIT_CONFIG,
  handler: rateLimitHandler
}));

// Body parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Logging middleware
app.use(morgan('combined', { stream }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// API routes (to be implemented)
// app.use('/api/feedback', feedbackRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/metrics', metricsRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error('UNHANDLED REJECTION! Shutting down...', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated!');
  });
});

export default app;
