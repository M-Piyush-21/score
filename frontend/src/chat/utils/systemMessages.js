import { generateMessageId } from './messageUtils';

export const createSystemMessage = (content) => ({
  id: generateMessageId(),
  content,
  username: 'System',
  timestamp: Date.now()
});

export const startSystemMessages = (socket) => {
  const interval = setInterval(() => {
    if (!socket.connected) {
      clearInterval(interval);
      return;
    }

    if (Math.random() < 0.1) {
      const messages = [
        'Remember to be respectful in chat!',
        'Having a great conversation? Don\'t forget to share your thoughts!',
        'Tip: You can change your username above.'
      ];
      
      const message = createSystemMessage(
        messages[Math.floor(Math.random() * messages.length)]
      );
      
      socket.emit('chat message', message);
    }
  }, 30000);

  return () => clearInterval(interval);
};