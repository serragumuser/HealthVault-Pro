/**
 * Winston Logger Configuration
 * Centralized logging utility with multiple transports
 */

import winston from 'winston';
import path from 'path';
import fs from 'fs';
import config from '../config';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Ensure log directory exists
const logDir = config.log.filePath;
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
  let log = `${timestamp} [${level}]: ${message}`;
  
  if (Object.keys(metadata).length > 0) {
    log += ` ${JSON.stringify(metadata)}`;
  }
  
  if (stack) {
    log += `\n${stack}`;
  }
  
  return log;
});

// Create logger instance
const logger = winston.createLogger({
  level: config.log.level,
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  defaultMeta: { service: 'healthvault-api' },
  transports: [
    // Error logs
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 10,
    }),
    // Combined logs
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 30,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'exceptions.log'),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'rejections.log'),
    }),
  ],
});

// Console transport for development
if (config.nodeEnv === 'development') {
  logger.add(
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'HH:mm:ss' }),
        printf(({ level, message, timestamp }) => {
          return `${timestamp} ${level}: ${message}`;
        })
      ),
    })
  );
}

// Helper methods for structured logging
export const logInfo = (message: string, meta?: Record<string, any>): void => {
  logger.info(message, meta);
};

export const logError = (message: string, error?: Error, meta?: Record<string, any>): void => {
  logger.error(message, { ...meta, error: error?.message, stack: error?.stack });
};

export const logWarn = (message: string, meta?: Record<string, any>): void => {
  logger.warn(message, meta);
};

export const logDebug = (message: string, meta?: Record<string, any>): void => {
  logger.debug(message, meta);
};

// HTTP request logger
export const logRequest = (req: any): void => {
  logger.info('HTTP Request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
};

// Database query logger
export const logQuery = (query: string, duration: number): void => {
  logger.debug('Database Query', {
    query,
    duration: `${duration}ms`,
  });
};

export default logger;
