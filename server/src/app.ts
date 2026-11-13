import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './modules/auth/routes.js';
import dashboardRoutes from './modules/dashboard/routes.js';
import announcementRoutes from './modules/announcements/routes.js';
import academicRoutes from './modules/academics/routes.js';
import aiRoutes from './modules/ai/routes.js';
import documentRoutes from './modules/documents/routes.js';
import eventRoutes from './modules/events/routes.js';
import notificationRoutes from './modules/notifications/routes.js';
import supportRoutes from './modules/support/routes.js';
import campusRoutes from './modules/campus/routes.js';
import adminRoutes from './modules/admin/routes.js';

export function createApp(): Express {
  const app = express();

  // Security & Utility Middleware
  app.use(helmet());
  app.use(
    cors({
      origin: [env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  );
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  if (env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      platform: 'CAMPUS OS API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      ai_model: env.GEMINI_MODEL
    });
  });

  // REST API v1 routing
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/dashboard', dashboardRoutes);
  app.use('/api/v1/announcements', announcementRoutes);
  app.use('/api/v1/academics', academicRoutes);
  app.use('/api/v1/ai', aiRoutes);
  app.use('/api/v1/documents', documentRoutes);
  app.use('/api/v1/events', eventRoutes);
  app.use('/api/v1/notifications', notificationRoutes);
  app.use('/api/v1/support', supportRoutes);
  app.use('/api/v1/campus', campusRoutes);
  app.use('/api/v1/admin', adminRoutes);

  // 404 Route Catcher
  app.use('*', (req: Request, res: Response) => {
    res.status(404).json({
      error: 'NotFound',
      message: `Route ${req.method} ${req.originalUrl} not found on CAMPUS OS API`
    });
  });

  // Centralized Error Interceptor
  app.use(errorHandler);

  return app;
}

