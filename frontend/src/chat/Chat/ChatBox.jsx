import React, { useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat.js';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { CardHeader, CardContent, CardFooter } from '../../components/ui/card';
import { Send, User } from 'lucide-react';

const ChatBox = () => {
  const messagesEndRef = useRef(null);
  const initialUsername = `User_${Math.floor(Math.random() * 1000)}`;
  const { messages, username, setUsername, sendMessage } = useChat(initialUsername);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (inputRef.current?.value) {
      sendMessage(inputRef.current.value);
      inputRef.current.value = '';
    }
  };

  return (
    <>
      <CardHeader className="border-b border-purple-800/20 p-4">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-purple-800/30 rounded-full">
            <User className="w-4 h-4 text-purple-300" />
          </div>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name"
            className="h-8 text-sm bg-purple-950/50 border-purple-800/30 text-purple-100 placeholder:text-purple-400/50 focus-visible:ring-purple-500"
          />
        </div>
      </CardHeader>

      <CardContent className="p-4 overflow-auto flex-1 space-y-4 scrollbar-thin scrollbar-thumb-purple-800/30 scrollbar-track-transparent">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col ${
              message.username === username ? 'items-end' : 'items-start'
            }`}
          >
            {message.username !== username && (
              <span className="text-xs text-purple-300/70 mb-1 px-2">
                {message.username}
              </span>
            )}
            <div
              className={`rounded-2xl px-4 py-2 max-w-[85%] break-words text-sm ${
                message.username === username
                  ? 'bg-purple-600 text-purple-50 rounded-br-sm'
                  : 'bg-purple-800/30 text-purple-100 rounded-bl-sm'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>

      <CardFooter className="border-t border-purple-800/20 p-4">
        <form 
          className="flex w-full gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <Input
            ref={inputRef}
            placeholder="Type your message..."
            className="flex-1 h-9 text-sm bg-purple-950/50 border-purple-800/30 text-purple-100 placeholder:text-purple-400/50 focus-visible:ring-purple-500"
          />
          <Button 
            type="submit"
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-purple-50 px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardFooter>
    </>
  );
};

export default ChatBox;