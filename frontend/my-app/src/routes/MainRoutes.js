import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from '../views/forms/LoginForm';
import RegisterForm from '../views/forms/RegisterForm';
import MainLayout from '../layouts/MainLayout';
// import Dashboard from '../views/Landing/Dashboard';
import { useAuth } from '../auth/auth';

const AuthenticatedRoute = ({ children }) => {
  const auth = useAuth(); // Corrected use of useAuth hook
  return auth.isAuthenticated ? children : <Navigate to="/login" />;
};

const MainRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/" element={<AuthenticatedRoute><MainLayout /></AuthenticatedRoute>} />
        <Route
          path="/"
          element={
            <AuthenticatedRoute>
              <MainLayout>
                {/* <Dashboard /> */}
              </MainLayout>
            </AuthenticatedRoute>
          }
        />
        {/* Additional routes that should be wrapped in MainLayout go here */}
      </Routes>
    </Router>
  );
};

export default MainRoutes;
