import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export const useAuth = () => {
  const [auth, setAuth] = useState({
    userId: localStorage.getItem('userId'),
    token: localStorage.getItem('authToken'),
    isAuthenticated: !!localStorage.getItem('authToken'),
  });

  useEffect(() => {
    // Update auth state if token or userId changes in localStorage
    const handleStorageChange = () => {
      setAuth({
        userId: localStorage.getItem('userId'),
        token: localStorage.getItem('authToken'),
        isAuthenticated: !!localStorage.getItem('authToken'),
      });
    };

    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const setAuthToken = (token) => {
    localStorage.setItem('authToken', token);
    setAuth((prevAuth) => ({ ...prevAuth, token, isAuthenticated: !!token }));
  };

  const setUser = (userId) => {
    localStorage.setItem('userId', userId);
    setAuth((prevAuth) => ({ ...prevAuth, userId }));
  };

  const clearAuth = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    setAuth({ userId: null, token: null, isAuthenticated: false });
  };

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (e) {
      console.error("Error decoding token: ", e);
      return true;
    }
  };

  const isAuthenticated = () => {
    return auth.token && !isTokenExpired(auth.token);
  };

  const authenticatedAxiosPost = async (url, data) => {
    if (!auth.isAuthenticated) {
      console.error("User is not authenticated");
      // Consider how you want to handle this case. You might want to return a specific error object or even throw a custom error.
      return { error: "User is not authenticated", status: 401 };
    }
    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return response;
    } catch (error) {
      // Log the error for debugging
      console.error("Error making authenticated POST request:", error);
  
      // Handle different types of errors and structure the error response accordingly
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        return { error: error.response.data, status: error.response.status };
      } else if (error.request) {
        // The request was made, but no response was received
        return { error: "The request was made but no response was received", status: null };
      } else {
        // Something happened in setting up the request
        return { error: "An error occurred while setting up the request", status: null };
      }
    }
  };
  
  const authenticatedAxiosGet = async (url) => {
    if (!auth.isAuthenticated) {
      console.error("User is not authenticated");
      // Consider returning a specific error object or throwing a custom error
      return { error: "User is not authenticated", status: 401 };
    }
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return response;
    } catch (error) {
      // Log the error for debugging
      console.error("Error making authenticated GET request:", error);
  
      // Handle different types of errors and structure the error response accordingly
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        return { error: error.response.data, status: error.response.status };
      } else if (error.request) {
        // The request was made, but no response was received
        return { error: "The request was made but no response was received", status: null };
      } else {
        // Something happened in setting up the request
        return { error: "An error occurred while setting up the request", status: null };
      }
    }
  };  

  // Expose the state and utility functions
  return { auth, setAuthToken, setUser, clearAuth, isAuthenticated, authenticatedAxiosPost, authenticatedAxiosGet };
};

