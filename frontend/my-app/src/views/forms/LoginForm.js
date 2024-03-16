import React, { useState } from 'react';
import { Card, CardContent, CardActions, TextField, Button, Typography, IconButton, InputAdornment, FormControlLabel, Checkbox, Box } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const LoginForm = ({ onNavigateToRegister }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  const validateForm = () => {
    if (!credentials.username) {
      setError('Username is required.');
      return false;
    }
    if (!credentials.username.includes('@')) {
      setError('Please enter a valid email address as your username.');
      return false;
    }
    if (!credentials.password) {
      setError('Password is required.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Reset error message

    if (!validateForm()) return; // Validate form and exit if validation fails

    try {
      // Simulate authentication logic
      console.log('Submitted:', credentials);
      // Assuming authentication is successful
      localStorage.setItem('authToken', 'simulated_token_from_backend');
      if (rememberMe) {
        console.log('Remember Me is enabled');
      }
      // Clear form and error states, or redirect to another page upon successful login
      setCredentials({ username: '', password: '' });
      setRememberMe(false);
    } catch (authError) {
      setError('Authentication failed. Please check your credentials and try again.');
    }
  };

  return (
    <Card sx={{ maxWidth: 345, mx: 'auto', mt: 5 }}>
      <CardContent>
        <Typography variant="h5" component="div" sx={{ textAlign: 'center' }}>
          MyApp Name Login
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
            autoFocus
            value={credentials.username}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={credentials.password}
            onChange={handleInputChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControlLabel
            control={<Checkbox checked={rememberMe} onChange={handleRememberMeChange} name="rememberMe" />}
            label="Remember Me"
          />
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          <CardActions>
            <Button type="submit" fullWidth variant="contained">Sign In</Button>
          </CardActions>
        </form>
      </CardContent>
      <Box textAlign="center" sx={{ mb: 2 }}>
        <Button onClick={onNavigateToRegister} variant="text">
          Don't have an account? Sign up
        </Button>
      </Box>
    </Card>
  );
};

export default LoginForm;
