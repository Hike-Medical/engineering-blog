import { backendApi } from '../../services/backendApi';
import { AuthUser } from '../types/AuthUser';

/**
 * Fetches the session information from the authenticated user's token.
 * Uses `fetch` since supported in all environments, i.e. Edge, Node, Browser, etc.
 */
export const fetchSessionUser = async (token: string | null): Promise<AuthUser> => {
  // Must be previously set via `configureServices`
  const baseUrl = backendApi.defaults.baseURL;

  if (!baseUrl) {
    throw new Error('Base URL not set for backend services.');
  }

  if (!token) {
    throw new Error('Token not found');
  }

  const response = await fetch(`${baseUrl}/auth/session`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('Session not found');
  }

  return await response.json();
};
