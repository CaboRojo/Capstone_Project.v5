import React, { useState } from 'react';
import './App.css';
import LoginForm from './views/forms/LoginForm';
import RegisterForm from './views/forms/RegisterForm';

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
