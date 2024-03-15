import React, { useState } from 'react';
import './App.css';
import LoginForm from './LoginForm'; // Import the LoginForm component
import RegisterForm from './RegisterForm'; // Import the RegisterForm component

function App() {
  const [view, setView] = useState('login'); // 'login' or 'register'

  const navigateToLogin = () => setView('login');
  const navigateToRegister = () => setView('register');

  return (
    <div className="App">
      {view === 'login' ? (
        <LoginForm onNavigateToRegister={navigateToRegister} />
      ) : (
        <RegisterForm onNavigateToLogin={navigateToLogin} />
      )}
    </div>
  );
}

export default App;
