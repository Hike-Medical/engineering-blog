import { AppId } from '../types/AppId';
import { DemoEnvironment } from '../types/DemoEnvironment';

/**
 * Returns the app name for the given app.
 */
export const appName = (appId: AppId): string => {
  switch (appId) {
    case '@demo/backend':
      return 'Demo API';
    default:
      return 'Demo';
  }
};

/**
 * Returns the API url for the given app and environment.
 */
export const apiUrl = (appId: AppId, environment: DemoEnvironment) => {
  if (environment === 'development') {
    return 'http://localhost:3000';
  }

  switch (appId) {
    case '@demo/frontend':
      return 'https://api.example2.com';
    default:
      return 'https://api.example.com';
  }
};

/**
 * Returns the app url for the given app and environment.
 */
export const appUrl = (appId: AppId, environment: DemoEnvironment) => {
  switch (appId) {
    case '@demo/frontend':
      switch (environment) {
        case 'development':
          return 'http://localhost:3001';
        default:
          return 'https://app.example2.com';
      }
    default:
      switch (environment) {
        case 'development':
          return 'http://localhost:3000';
        default:
          return 'https://app.example.com';
      }
  }
};
