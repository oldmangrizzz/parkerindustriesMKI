import React, { useRef, useEffect } from 'react';
import { MessageSquare, User } from 'lucide-react';

interface Message {
  text: string;
  sender: string;
}

interface ChatInterfaceProps {
  messages: Message[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-4 h-[calc(100vh-200px)] overflow-y-auto">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`mb-4 ${
            message.sender === 'user' ? 'text-right' : 'text-left'
          }`}
        >
          <div
            className={`inline-block p-3 rounded-lg ${
              message.sender === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-purple-500 text-white'
            }`}
          >
            {message.sender === 'user' ? (
              <User size={16} className="inline mr-2" />
            ) : (
              <MessageSquare size={16} className="inline mr-2" />
            )}
            {message.text}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatInterface;