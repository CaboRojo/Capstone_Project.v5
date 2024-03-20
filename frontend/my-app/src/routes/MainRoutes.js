import React from 'react';
import { Navigate } from 'react-router-dom'; // Adjusted import for v6
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../views/Landing';
import { useAuth } from '../auth/auth';
import LoginForm from '../views/forms/LoginForm';
import RegisterForm from '../views/forms/RegisterForm';

// Helper component to handle route protection
const ProtectedRoute = ({ children }) => {
  const auth = useAuth();
  console.log("ProtectedRoute auth state:", auth); // Debugging auth state

  if (!auth.isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Adjusted for React Router v6 useRoutes compatibility
const MainRoutes = [
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: 'login', element: <LoginForm /> },
  { path: 'register', element: <RegisterForm /> },
  {
    path: '/', // Added path for grouping under a common path if needed
    element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      // Additional protected routes can be added here
    ],
  },
];

export default MainRoutes;
