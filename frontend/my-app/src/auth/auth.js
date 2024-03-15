// auth.js
const setAuthToken = (token) => {
    localStorage.setItem('authToken', token);
  };
  
  const setUser = (userId) => {
    localStorage.setItem('userId', userId);
  };
  
  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };
  
  const getUser = () => {
    return localStorage.getItem('userId');
  };
  
  const clearAuth = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
  };
  
  export { setAuthToken, setUser, getAuthToken, getUser, clearAuth };
  