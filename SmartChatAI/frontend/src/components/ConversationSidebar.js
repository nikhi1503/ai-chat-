import React, { useState } from 'react';
import { chatAPI } from '../utils/api';

export const ConversationSidebar = ({ conversations, selectedConv, onSelectConv, onNewConv, onDeleteConv }) => {
  const [loading, setLoading] = useState(false);

  const handleNewConversation = async () => {
    setLoading(true);
    try {
      const response = await chatAPI.createConversation({ title: 'New Conversation' });
      onNewConv(response.data);
      onSelectConv(response.data._id);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-64 bg-dark text-white h-screen overflow-y-auto shadow-lg">
      <div className="p-4">
        <button
          onClick={handleNewConversation}
          disabled={loading}
          className="w-full bg-primary hover:bg-secondary text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
        >
          + New Chat
        </button>
      </div>

      <div className="space-y-2 px-4">
        {conversations.map(conv => (
          <div
            key={conv._id}
            className={`p-3 rounded-lg cursor-pointer transition group relative ${
              selectedConv === conv._id ? 'bg-primary' : 'hover:bg-gray-700'
            }`}
            onClick={() => onSelectConv(conv._id)}
          >
            <p className="truncate text-sm">{conv.title}</p>
            <p className="text-xs opacity-70">
              {new Date(conv.createdAt).toLocaleDateString()}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteConv(conv._id);
              }}
              className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 bg-red-600 text-white p-1 rounded hover:bg-red-700 transition"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
