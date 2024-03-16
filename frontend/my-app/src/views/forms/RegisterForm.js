import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Typography, Box } from '@mui/material';

const RegisterForm = ({ onNavigateToLogin }) => {
  const [userDetails, setUserDetails] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleInputChange = (event) => {
    setUserDetails({ ...userDetails, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    if (!userDetails.username) {
      setError('Username is required.');
      return false;
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(userDetails.username)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (!userDetails.password || userDetails.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }
    if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(userDetails.password)) {
      setError('Password must include uppercase, lowercase, and a number.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Reset error message

    if (!validateForm()) return; // Validate form and exit if validation fails

    try {
      // Simulate registration logic
      console.log('Registration Details:', userDetails);
      // Assuming registration is successful, clear form
      setUserDetails({ username: '', password: '' });
      // Navigate to login page or show success message
      onNavigateToLogin(); // This should be handled to show the login form
    } catch (registrationError) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <Card sx={{ maxWidth: 345, mx: 'auto', mt: 5 }}>
      <CardContent>
        <Typography variant="h5" component="div" sx={{ textAlign: 'center' }}>
          Welcome to Our App
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username (Email)"
            name="username"
            autoComplete="username"
            value={userDetails.username}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={userDetails.password}
            onChange={handleInputChange}
          />
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Register
          </Button>
        </form>
      </CardContent>
      <Box textAlign="center" sx={{ mb: 2 }}>
        <Button onClick={onNavigateToLogin} variant="text">
          Already have an account? Log in
        </Button>
      </Box>
    </Card>
  );
};

export default RegisterForm;
