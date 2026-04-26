


import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectDB from './config/database';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { setupSocket } from './config/socket';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // ✅ Create HTTP server
    const httpServer = createServer(app);

    // ✅ Socket.io setup
    const io = new Server(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL || '*',
        credentials: true
      }
    });
    setupSocket(io);

    // ✅ START SERVER (IMPORTANT)
    httpServer.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error('❌ Server start failed:', err);
    process.exit(1);
  }
};

startServer();