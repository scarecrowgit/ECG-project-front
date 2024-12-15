import axios from 'axios';

// Create an instance of axios with a base URL
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // Replace with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;