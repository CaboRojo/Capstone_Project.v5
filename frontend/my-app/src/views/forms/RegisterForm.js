import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, TextField, Button, Typography, Box } from '@mui/material';

const RegisterForm = ({ onNavigateToLogin }) => {
  const [userDetails, setUserDetails] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleInputChange = (event) => {
    setUserDetails({ ...userDetails, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    if (!userDetails.username.trim()) {
      setError('Username is required.');
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
    setError('');
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      // Here we make the Axios POST request to the registration endpoint
      const response = await axios.post('/handle_register', userDetails);
      // Assuming the response from the server is successful, navigate to login
      // For actual navigation, you might need to adjust depending on your routing setup
      onNavigateToLogin();
    } catch (error) {
      // Handle errors, e.g., show a user-friendly message
      if (error.response) {
        // Server responded with a status code outside the 2xx range
        setError(error.response.data.message || 'Registration failed. Please try again.');
      } else if (error.request) {
        // The request was made but no response was received
        setError('No response from the server. Please try again later.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('Registration failed due to an unexpected error. Please try again.');
      }
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
            label="Username"
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
