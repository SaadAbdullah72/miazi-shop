import axios from 'axios';

export const BASE_URL = ''; // Use relative path for Vercel rewrites and Vite proxy

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Important for cookies (JWT)
});

export default api;
