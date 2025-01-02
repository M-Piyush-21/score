import { useState, useEffect, useRef, useCallback } from 'react';
import { createMockSocket } from '../utils/mockSocket';
import { startSystemMessages } from '../utils/systemMessages';
import { generateMessageId } from '../utils/messageUtils';

export const useChat = (initialUsername) => {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState(initialUsername);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = createMockSocket();

    socketRef.current.on('chat message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    const cleanup = startSystemMessages(socketRef.current);

    return () => {
      cleanup();
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = useCallback((content) => {
    const messageData = {
      id: generateMessageId(),
      content,
      username,
      timestamp: Date.now()
    };

    socketRef.current.emit('chat message', messageData);
  }, [username]);

  return {
    messages,
    username,
    setUsername,
    sendMessage
  };
};