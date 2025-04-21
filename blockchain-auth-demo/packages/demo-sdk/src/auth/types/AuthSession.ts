import { AuthUser } from './AuthUser';

export interface AuthSession {
  user: AuthUser;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
