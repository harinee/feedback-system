"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stream = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
// Define log levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
// Define log level based on environment
const level = () => {
    const env = process.env.NODE_ENV || 'development';
    return env === 'development' ? 'debug' : 'warn';
};
// Define colors for each level
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
};
// Add colors to winston
winston_1.default.addColors(colors);
// Define the format for logging
const format = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`));
// Define where to store the logs
const transports = [
    // Console transport for all logs
    new winston_1.default.transports.Console(),
    // File transport for error logs
    new winston_1.default.transports.File({
        filename: path_1.default.join('logs', 'error.log'),
        level: 'error',
    }),
    // File transport for all logs
    new winston_1.default.transports.File({
        filename: path_1.default.join('logs', 'all.log'),
    }),
];
// Create the logger instance
const logger = winston_1.default.createLogger({
    level: level(),
    levels,
    format,
    transports,
});
exports.logger = logger;
// Create a stream object for Morgan integration
const stream = {
    write: (message) => {
        logger.http(message.trim());
    },
};
exports.stream = stream;
