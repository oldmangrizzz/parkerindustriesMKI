const logger = require('../utils/logger');

exports.setupWebSocket = (io) => {
  io.on('connection', (socket) => {
    logger.info('New WebSocket connection');

    socket.on('executeCode', async (data) => {
      try {
        // Implement code execution logic here
        const result = 'Code execution result';
        socket.emit('codeResult', result);
      } catch (error) {
        logger.error('Error executing code via WebSocket:', error);
        socket.emit('error', 'Code execution failed');
      }
    });

    socket.on('disconnect', () => {
      logger.info('WebSocket disconnected');
    });
  });
};