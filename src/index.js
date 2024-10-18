import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import http from 'http';
import { Server } from 'socket.io';
import logger from './utils/logger.js';
import memoryRoutes from './routes/memoryRoutes.js';
import codeExecutionRoutes from './routes/codeExecutionRoutes.js';
import { setupWebSocket } from './services/websocketService.js';
import { connectRedis } from './services/redisService.js';
import { initializeConvex } from './services/convexService.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.VITE_APP_URL,
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet());
app.use(express.json());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// Routes
app.use('/api/memory', memoryRoutes);
app.use('/api/execute', codeExecutionRoutes);

// WebSocket setup
setupWebSocket(io);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectRedis();
    await initializeConvex();
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();