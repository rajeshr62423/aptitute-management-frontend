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
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject({ ...error, message });
  }
);

export default apiClient;
