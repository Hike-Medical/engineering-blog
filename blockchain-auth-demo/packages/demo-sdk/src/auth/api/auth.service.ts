import { backendApi } from '../../services/backendApi';
import { CreateUserParams } from '../../types/CreateUserParams';
import type { AuthSession } from '../types/AuthSession';

export const signIn = async (credentials: { email: string; password: string }): Promise<AuthSession | null> => {
  const response = await backendApi.post(`auth/login`, credentials);
  return response.data;
};

export const signUp = async (credentials: CreateUserParams) => {
  const response = await backendApi.post('auth/signup', credentials);
  return response.data;
};

export const refreshToken = async (token?: string): Promise<AuthSession> => {
  const response = await backendApi.post(`auth/refresh`, { token });
  return response.data;
};

export const logout = async (): Promise<void> => {
  const response = await backendApi.post('auth/logout');
  return response.data;
};
