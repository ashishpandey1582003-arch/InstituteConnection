// Default to port 5000 because the backend runs on port 5000 during development
const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = rawApiUrl.replace(/\/$/, '');
const BACKEND_URL = API_URL.replace(/\/api\/?$/, '');

export { API_URL, BACKEND_URL };
