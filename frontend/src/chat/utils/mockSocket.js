import { generateMessageId } from './messageUtils';

class MockSocket {
  constructor() {
    this.listeners = new Map();
    this.connected = true;
    this.messageCount = 0;
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        setTimeout(() => {
          callback(data);
        }, Math.random() * 500);
      });
    }
  }

  disconnect() {
    this.connected = false;
    this.listeners.clear();
  }
}

export const createMockSocket = () => {
  const socket = new MockSocket();
  
  // Send welcome message
  setTimeout(() => {
    socket.emit('chat message', {
      id: generateMessageId(),
      content: 'Welcome to the chat!',
      username: 'System',
      timestamp: Date.now()
    });
  }, 1000);

  return socket;
};