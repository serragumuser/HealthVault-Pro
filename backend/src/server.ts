/**
 * Main Server Entry Point
 * HealthVault Pro API Server
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import config from './config';
import { logInfo, logError } from './utils/logger';
import { AppError } from './types';

// Initialize Prisma Client
export const prisma = new PrismaClient({
  log: config.nodeEnv === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Initialize Express application
const app: Application = express();

// ==================== MIDDLEWARE ====================

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to API routes only
app.use(`${config.apiPrefix}/`, limiter);

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logInfo('HTTP Request', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    });
  });
  
  next();
});

// ==================== ROUTES ====================

// Health check endpoint
app.get('/health', async (_req: Request, res: Response) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      success: true,
      message: 'HealthVault Pro API is running',
      data: {
        status: 'healthy',
        environment: config.nodeEnv,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: 'connected',
      },
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Service unavailable',
      data: {
        status: 'unhealthy',
        database: 'disconnected',
      },
    });
  }
});

// API version info
app.get(`${config.apiPrefix}/`, (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'HealthVault Pro API v1',
    data: {
      version: '1.0.0',
      documentation: '/api/v1/docs',
      endpoints: {
        auth: `${config.apiPrefix}/auth`,
        patients: `${config.apiPrefix}/patients`,
        doctors: `${config.apiPrefix}/doctors`,
        appointments: `${config.apiPrefix}/appointments`,
        prescriptions: `${config.apiPrefix}/prescriptions`,
        labResults: `${config.apiPrefix}/lab-results`,
        ai: `${config.apiPrefix}/ai`,
      },
    },
  });
});

// Import and register API routes
import routes from './routes';
app.use(config.apiPrefix, routes);

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    code: 'ROUTE_NOT_FOUND',
  });
});

// Global error handler
app.use((err: Error | AppError, req: Request, res: Response, _next: NextFunction) => {
  // Log error
  logError('Application Error', err, {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
  });

  // Determine status code
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const isOperational = err instanceof AppError ? err.isOperational : false;

  // Send error response
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    code: err instanceof AppError ? err.code : 'INTERNAL_ERROR',
    ...(config.nodeEnv === 'development' && {
      stack: err.stack,
      details: err,
    }),
  });

  // If error is not operational, exit process
  if (!isOperational && config.nodeEnv === 'production') {
    logError('Fatal error occurred. Shutting down...', err);
    process.exit(1);
  }
});

// ==================== SERVER STARTUP ====================

const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await prisma.$connect();
    logInfo('Database connected successfully');

    // Start Express server
    const server = app.listen(config.port, () => {
      logInfo(`Server started successfully`, {
        port: config.port,
        environment: config.nodeEnv,
        apiPrefix: config.apiPrefix,
      });
    });

    // Graceful shutdown handler
    const gracefulShutdown = async (signal: string) => {
      logInfo(`${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        logInfo('HTTP server closed');

        try {
          await prisma.$disconnect();
          logInfo('Database disconnected');
          
          logInfo('Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          logError('Error during shutdown', error as Error);
          process.exit(1);
        }
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        logError('Forced shutdown after timeout');
        process.exit(1);
      }, 30000);
    };

    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      logError('Uncaught Exception', error);
      gracefulShutdown('uncaughtException');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: any) => {
      logError('Unhandled Rejection', new Error(reason));
      gracefulShutdown('unhandledRejection');
    });

  } catch (error) {
    logError('Failed to start server', error as Error);
    process.exit(1);
  }
};

// Start server if not in test environment
if (require.main === module) {
  startServer();
}

export default app;
