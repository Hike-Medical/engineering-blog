import type { DemoConfig } from '../types/DemoConfig';
import { apiUrl, appUrl } from '../utils/appUtils';
import { backendApi } from './backendApi';

/**
 * Provisions the services module.
 */
export const configureServices = (config: DemoConfig): Omit<DemoConfig, 'cookies'> => {
  const baseAppUrl = config.appId && config.appEnv ? appUrl(config.appId, config.appEnv) : null;
  const baseApiUrl = config.apiUrl || (config.appId && config.appEnv ? apiUrl(config.appId, config.appEnv) : null);
  const versionedApiUrl = baseApiUrl && `${baseApiUrl}/v1`;

  backendApi.defaults.headers.common['x-app-url'] ??= baseAppUrl;
  backendApi.defaults.headers.common['x-app-env'] ??= config.appEnv;
  backendApi.defaults.headers.common['x-app-id'] ??= config.appId;
  backendApi.defaults.headers.common['x-app-version'] ??= config.appVersion;
  backendApi.defaults.headers.common['x-time-zone'] = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Set the base URL for backend API requests
  if (versionedApiUrl && versionedApiUrl !== backendApi.defaults.baseURL) {
    backendApi.defaults.baseURL = versionedApiUrl;
  }

  // Set the cookie for server-side requests
  if (config.cookies && typeof window === 'undefined') {
    backendApi.interceptors.request.use(
      (backendConfig) => {
        const newConfig = backendConfig;
        newConfig.headers.set('Cookie', config.cookies);
        return newConfig;
      },
      (error) => Promise.reject(error)
    );
  }

  // Remove sensitive information from config to avoid leaking it to the client
  const { cookies: _cookies, ...safeConfig } = config;

  // Return safe config to initialize client-side if needed
  return safeConfig;
};

/**
 * Provisions the services with an auth bearer token.
 */
export const configureAuthorization = (token: string | null) => {
  backendApi.defaults.headers.common.Authorization = token && `Bearer ${token}`;
};
