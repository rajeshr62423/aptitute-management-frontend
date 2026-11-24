import axios from 'axios';
import { handleMockRequest } from './mockApiService';

let rawBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
// If rawBaseURL ends with '/api', strip it because all sagas explicitly request '/api/...'
if (rawBaseURL.endsWith('/api')) {
  rawBaseURL = rawBaseURL.slice(0, -4);
}
const baseURL = rawBaseURL;

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Custom adapter to handle mock requests during development/demo while allowing seamless swap with real backend
const isMockEnabled =
  process.env.NEXT_PUBLIC_USE_MOCK === 'true' ||
  (!process.env.NEXT_PUBLIC_API_BASE_URL?.startsWith('http') &&
    process.env.NEXT_PUBLIC_USE_MOCK !== 'false');

if (isMockEnabled) {
  apiClient.defaults.adapter = async (config) => {
    // Simulate network latency (100ms) for realistic Redux-Saga asynchronous lifecycle
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      const mockRes = handleMockRequest(config);
      return {
        data: mockRes.data,
        status: mockRes.status,
        statusText: 'OK',
        headers: {},
        config,
        request: {},
      };
    } catch (error) {
      return Promise.reject(error);
    }
  };
}

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Prevent accidental double /api/ prefix
    if (config.url && config.url.startsWith('/api/api/')) {
      config.url = config.url.replace('/api/api/', '/api/');
    }
    if (config.baseURL?.endsWith('/api') && config.url?.startsWith('/api/')) {
      config.url = config.url.replace(/^\/api\//, '/');
    }

    if (typeof window !== 'undefined') {
      const token =
        sessionStorage.getItem('ap_admin_token') ||
        localStorage.getItem('ap_admin_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let userMessage = 'An unexpected error occurred. Please try again.';

    if (error.response) {
      const status = error.response.status;
      const serverMessage = error.response.data?.message;

      if (serverMessage && typeof serverMessage === 'string') {
        userMessage = serverMessage;
      } else if (Array.isArray(serverMessage) && serverMessage.length > 0) {
        userMessage = serverMessage.join(', ');
      } else if (status === 400) {
        userMessage = 'Invalid request. Please check the submitted data.';
      } else if (status === 401) {
        userMessage = 'Session expired or invalid credentials. Please sign in again.';
      } else if (status === 403) {
        userMessage = 'You do not have permission to access this resource.';
      } else if (status === 404) {
        userMessage = 'The requested resource could not be found.';
      } else if (status === 409) {
        userMessage = 'Conflict detected. This record may already exist.';
      } else if (status === 422) {
        userMessage = 'Validation failed. Please verify your input.';
      } else if (status === 429) {
        userMessage = 'Too many requests. Please wait a moment and try again.';
      } else if (status >= 500) {
        userMessage = 'Server is currently unavailable. Please try again later.';
      }
    } else if (error.code === 'ECONNABORTED') {
      userMessage = 'The request timed out. Please check your connection and try again.';
    } else if (error.code === 'ERR_NETWORK' || !navigator.onLine) {
      userMessage = 'Network connection interrupted. Please check your internet connection.';
    }

    return Promise.reject({ ...error, message: userMessage });
  }
);

export default apiClient;
