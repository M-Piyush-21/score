import React from 'react';
import { formatTimestamp } from '../utils/messageUtils.js';

const ChatMessage = ({ message, isOwn }) => {
  const formattedTime = formatTimestamp(message.timestamp);
  const isSystem = message.username === 'System';

  return (
    <div 
      className={`chat-message ${isOwn ? 'own-message' : 'other-message'} ${
        isSystem ? 'system-message' : ''
      }`}
    >
      <span className="username">
        {isSystem ? '💬 ' : ''}
        {message.username}
      </span>
      <p className="message-content">{message.content}</p>
      <span className="timestamp">{formattedTime}</span>
    </div>
  );
};

export default ChatMessage;