import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/useAuth';

export const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">SmartChat AI</h1>
          <p className="text-xl mb-4">
            Intelligent conversational AI powered by machine learning and natural language processing
          </p>
          <p className="text-lg opacity-90 mb-12">
            Experience seamless communication with an AI assistant trained to understand and respond
            to your queries intelligently
          </p>

          {isAuthenticated ? (
            <Link
              to="/chat"
              className="inline-block bg-white text-primary font-bold py-3 px-8 rounded-lg hover:opacity-90 transition text-lg"
            >
              Go to Chat
            </Link>
          ) : (
            <div className="space-x-4">
              <Link
                to="/login"
                className="inline-block bg-white text-primary font-bold py-3 px-8 rounded-lg hover:opacity-90 transition text-lg"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-block bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-primary transition text-lg"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-3">🤖 AI-Powered</h3>
            <p>Advanced NLP models trained to understand context and provide meaningful responses</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-3">💬 Real-Time Chat</h3>
            <p>Instant responses with real-time message delivery and conversation history</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-3">🔒 Secure</h3>
            <p>End-to-end encryption and secure authentication for your peace of mind</p>
          </div>
        </div>
      </div>
    </div>
  );
};
