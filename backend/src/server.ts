import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import connectDB from './config/database';

const PORT = process.env.PORT || 5000;

// Handle server startup with port error handling
const startServer = async () => {
  try {
    await connectDB();
    
    const server = app.listen(PORT, () => {
      console.log(`
    ✅ Server running on port ${PORT}
    📍 Health Check: http://localhost:${PORT}/health
    🔗 API Base URL: http://localhost:${PORT}/api/v1
    🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}
    `);
    });

    // Handle server errors
    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please kill the process using this port and try again.`);
        console.log(`   Run: lsof -ti:${PORT} | xargs kill -9 (Mac/Linux) or netstat -ano | findstr :${PORT} (Windows)`);
        process.exit(1);
      } else {
        console.error('Server error:', error);
        process.exit(1);
      }
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err: Error) => {
      console.error('❌ Unhandled Rejection:', err.message);
      console.error(err.stack);
      server.close(() => process.exit(1));
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err: Error) => {
      console.error('❌ Uncaught Exception:', err.message);
      console.error(err.stack);
      server.close(() => process.exit(1));
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();