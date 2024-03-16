import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './views/forms/LoginForm';
import RegisterForm from './views/forms/RegisterForm';
// import Dashboard from './components/Dashboard';
import { isAuthenticated } from '././auth'; // Function to check if user is authenticated

const MainRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/dashboard"
          element={isAuthenticated() ? <Dashboard /> : <Navigate replace to="/login" />}
        />
        {/* Additional routes for your application */}
      </Routes>
    </Router>
  );
};

export default MainRoutes;
