"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../utils/logger");
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/feedback-system';
        const options = {
            autoIndex: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4
        };
        await mongoose_1.default.connect(mongoURI, options);
        mongoose_1.default.connection.on('connected', () => {
            logger_1.logger.info('MongoDB connected successfully');
        });
        mongoose_1.default.connection.on('error', (err) => {
            logger_1.logger.error('MongoDB connection error:', err);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            logger_1.logger.warn('MongoDB disconnected');
        });
        // Handle application termination
        process.on('SIGINT', async () => {
            try {
                await mongoose_1.default.connection.close();
                logger_1.logger.info('MongoDB connection closed through app termination');
                process.exit(0);
            }
            catch (err) {
                logger_1.logger.error('Error closing MongoDB connection:', err);
                process.exit(1);
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};
exports.default = connectDB;
