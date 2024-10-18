import { io, Socket } from 'socket.io-client';
import { WEBSOCKET_URL } from '../config/env';
import logger from '../utils/logger';

class WebSocketService {
  private socket: Socket | null = null;

  connect() {
    this.socket = io(WEBSOCKET_URL);

    this.socket.on('connect', () => {
      logger.info('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      logger.info('WebSocket disconnected');
    });

    this.socket.on('error', (error) => {
      logger.error('WebSocket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    } else {
      logger.warn('WebSocket not connected. Unable to emit event:', event);
    }
  }

  on(event: string, callback: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    } else {
      logger.warn('WebSocket not connected. Unable to listen for event:', event);
    }
  }

  off(event: string, callback?: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

export default new WebSocketService();