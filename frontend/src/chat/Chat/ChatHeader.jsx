import React from 'react';

const ChatHeader = ({ username, onUsernameChange }) => {
  return (
    <div className="chat-header">
      <h3>Live Chat (Demo Mode)</h3>
      <input
        type="text"
        value={username}
        onChange={(e) => onUsernameChange(e.target.value)}
        placeholder="Your username"
        className="username-input"
      />
    </div>
  );
};

export default ChatHeader;