import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../utils/useAuth';

export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/chat" replace />;
  }

  return children;
};
