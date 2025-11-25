import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Component to protect routes that require authentication
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Component to protect admin-only routes
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, userData } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (userData?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};
