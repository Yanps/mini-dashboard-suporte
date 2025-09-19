import io from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    const WS_URL = process.env.REACT_APP_WS_URL || 'http://localhost:3000';
    
    if (!this.socket) {
      this.socket = io(WS_URL);
      this.setupEventListeners();
    }
    
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  setupEventListeners() {
    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    this.socket.on('ticketCreated', (ticket) => {
      this.emitToListeners('ticketCreated', ticket);
    });

    this.socket.on('ticketUpdated', (ticket) => {
      this.emitToListeners('ticketUpdated', ticket);
    });

    this.socket.on('ticketDeleted', (data) => {
      this.emitToListeners('ticketDeleted', data);
    });
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  emitToListeners(event, data) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  joinRoom(room) {
    if (this.socket) {
      this.socket.emit('joinRoom', room);
    }
  }

  leaveRoom(room) {
    if (this.socket) {
      this.socket.emit('leaveRoom', room);
    }
  }
}

export default new WebSocketService();

