import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import passport from 'passport';
import connectDB from './config/database';
import routes from './routes';
import errorHandler from './middleware/error.middleware';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { setupSocket } from './config/socket';
import chatRoutes from './routes/chat.routes';
import analysisRoutes from './routes/analysis.routes';
import symptomRoutes from './routes/symptom.routes';
import dotenv from 'dotenv';
import bloodRoutes from './routes/blood.routes';
import path from 'path';

const app: Application = express();
dotenv.config();

// Connect to MongoDB
connectDB();

// CRITICAL FIX: Simple CORS configuration that works
app.use(cors({
origin: [
  'http://localhost:3000',
  'https://medicarenepal.vercel.app/'
],  
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Session middleware
app.use(session({
  secret: process.env.JWT_SECRET || 'medicare-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
      sameSite: 'none',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Other middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.set('trust proxy', 1);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Debug endpoint to check if cookie is received
app.get('/debug/cookie', (req, res) => {
  console.log('Cookie received at debug endpoint:', req.cookies);
  res.json({ 
    cookies: req.cookies,
    hasToken: !!req.cookies?.token,
    cookieHeader: req.headers.cookie
  });
});

// API routes
app.use('/api/v1', routes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/analysis', analysisRoutes);
app.use('/api/v1/symptom', symptomRoutes);
app.use('/api/v4/blood', bloodRoutes);

// 404 handler
app.use('*', (_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);



export default app;