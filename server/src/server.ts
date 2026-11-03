import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { ENV } from './config/env';
import { connectDB } from './config/db';
import { initRedis } from './config/redis';
import { globalLimiter } from './middleware/rateLimit.middleware';
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler.middleware';

// Routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import requestRoutes from './routes/request.routes';
import donationRoutes from './routes/donation.routes';
import connectionRoutes from './routes/connection.routes';
import notificationRoutes from './routes/notification.routes';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost and same-origin or tool requests
      if (!origin || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(globalLimiter);

// Health & System Status Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'RoktoBondhu Backend API is operational',
    timestamp: new Date().toISOString(),
    environment: ENV.NODE_ENV,
    version: '1.0.0',
  });
});

// Mount Feature API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/notifications', notificationRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start server only when not running in automated test mode
export const startServer = async () => {
  console.log('--------------------------------------------------');
  console.log(' Starting RoktoBondhu Backend Services...');
  console.log('--------------------------------------------------');

  // Start HTTP listener immediately so server is instantly ready
  const server = app.listen(ENV.PORT, '0.0.0.0', () => {
    console.log(`[RoktoBondhu API] Running on http://127.0.0.1:${ENV.PORT}`);
    console.log(`[Health Check]   http://127.0.0.1:${ENV.PORT}/api/health`);
    console.log('--------------------------------------------------');
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[RoktoBondhu API] Port ${ENV.PORT} is already in use. Existing instance is active.`);
    } else {
      console.error('[RoktoBondhu API] Server error:', err.message);
    }
  });

  // Initialize Cache & Database in parallel
  initRedis();
  connectDB().catch((err) => {
    console.warn('[MongoDB] Init error:', err.message);
  });

  return server;
};

if (process.env.NODE_ENV !== 'test') {
  startServer().catch((err) => {
    console.error('Fatal Server Startup Error:', err);
    process.exit(1);
  });
}

export default app;
