import React, { useState } from 'react';

export const ChatInput = ({ onSendMessage, loading }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !loading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </form>
  );
};
