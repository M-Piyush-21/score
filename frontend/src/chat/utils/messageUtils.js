export const generateMessageId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString();
};

export const SYSTEM_MESSAGES = [
  'Remember to be respectful in chat!',
  'Having a great conversation? Don\'t forget to share your thoughts!',
  'Tip: You can change your username above.'
];