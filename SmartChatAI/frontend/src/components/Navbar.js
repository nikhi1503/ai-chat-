import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/useAuth';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold">
            SmartChat AI
          </Link>
          {user && (
            <>
              <Link to="/chat" className="hover:opacity-80 transition">
                Chat
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="hover:opacity-80 transition">
                  Admin
                </Link>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm">{user.name}</span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:opacity-80 transition">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-secondary px-4 py-2 rounded hover:opacity-80 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
