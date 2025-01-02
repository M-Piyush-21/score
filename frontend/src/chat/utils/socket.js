import { io } from 'socket.io-client';

export const initializeSocket = () => {
  // For development, connect to a free chat server
  // In production, you would use your own server
  const socket = io('wss://free.blr2.piesocket.com/v3/1?api_key=VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV');
  
  socket.on('connect', () => {
    console.log('Connected to chat server');
  });

  socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
  });

  return socket;
};