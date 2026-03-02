import React, { useEffect, useState } from 'react';
import { chatAPI } from '../utils/api';
import { ChatMessages } from '../components/ChatMessages';
import { ChatInput } from '../components/ChatInput';
import { ConversationSidebar } from '../components/ConversationSidebar';

export const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConvId, setSelectedConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);

  // Load conversations
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const response = await chatAPI.getConversations();
      setConversations(response.data);
      if (response.data.length > 0) {
        loadConversation(response.data[0]._id);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoadingConversations(false);
    }
  };

  const loadConversation = async (convId) => {
    try {
      const response = await chatAPI.getConversation(convId);
      setMessages(response.data.messages);
      setSelectedConvId(convId);
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  const handleSendMessage = async (text) => {
    if (!selectedConvId) return;

    setLoading(true);
    try {
      const response = await chatAPI.sendMessage({
        conversationId: selectedConvId,
        message: text,
      });
      setMessages(response.data.conversation.messages);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConversation = async (convId) => {
    if (window.confirm('Delete this conversation?')) {
      try {
        await chatAPI.deleteConversation(convId);
        setConversations(conversations.filter(c => c._id !== convId));
        if (selectedConvId === convId) {
          setSelectedConvId(null);
          setMessages([]);
        }
      } catch (error) {
        console.error('Failed to delete conversation:', error);
      }
    }
  };

  if (loadingConversations) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-light">
      <ConversationSidebar
        conversations={conversations}
        selectedConv={selectedConvId}
        onSelectConv={loadConversation}
        onNewConv={(newConv) => setConversations([newConv, ...conversations])}
        onDeleteConv={handleDeleteConversation}
      />

      <div className="flex-1 flex flex-col">
        {selectedConvId ? (
          <>
            <ChatMessages messages={messages} loading={loading} />
            <ChatInput onSendMessage={handleSendMessage} loading={loading} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p className="text-lg font-semibold">No conversations yet</p>
              <p className="text-sm">Create a new chat to get started</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
