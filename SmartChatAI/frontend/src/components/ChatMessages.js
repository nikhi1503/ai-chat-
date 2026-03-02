import React, { useEffect, useRef } from 'react';

export const ChatMessages = ({ messages, loading }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      {messages.length === 0 && !loading && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            <p className="text-lg font-semibold">Start a conversation</p>
            <p className="text-sm">Ask me anything!</p>
          </div>
        </div>
      )}

      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              msg.sender === 'user'
                ? 'bg-primary text-white rounded-br-none'
                : 'bg-gray-200 text-gray-800 rounded-bl-none'
            }`}
          >
            <p className="break-words">{msg.text}</p>
            <span className="text-xs opacity-70 mt-1 block">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      ))}

      {loading && (
        <div className="flex justify-start">
          <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg rounded-bl-none">
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};
