import axios from 'axios';
import { currentUrl } from '../utils/currentUrl';

/**
 * Instance for making backend API requests.
 */
export const backendApi = axios.create({
  adapter: 'fetch',
  withCredentials: true
});

// The current URL and workspace is added to all request headers via interceptor.
backendApi.interceptors.request.use(
  (config) => {
    const newConfig = config;
    const url = currentUrl();

    if (url) {
      newConfig.headers['x-current-url'] = url.href;
    }

    return newConfig;
  },
  (error) => Promise.reject(error)
);
