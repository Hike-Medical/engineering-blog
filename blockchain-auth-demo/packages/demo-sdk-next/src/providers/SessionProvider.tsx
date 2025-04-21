'use client';

import { AuthStatus, AuthUser, logout as backendLogout, configureAuthorization, refreshToken } from '@demo/sdk';
import { decodeJwt } from 'jose';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface SessionState {
  user: AuthUser | null;
  status: AuthStatus;
  accessToken: string | null;
  expiresAt: Date | null;
  update: (newTokens?: Tokens | null) => Promise<void>;
  logout: () => Promise<void>;
}

export const SessionContext = createContext<SessionState>(undefined as never);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('LOADING');
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);

  const update = async (newTokens?: Tokens | null) => {
    try {
      setStatus('LOADING');
      const latest = newTokens ?? tokens ?? null;
      const value = await refreshToken(latest?.refreshToken);
      configureAuthorization(null);
      setUser(value.user);
      setStatus(value ? 'AUTHENTICATED' : 'UNAUTHENTICATED');
      setTokens(value.tokens);
      const decoded = decodeJwt(value.tokens.accessToken);
      setExpiresAt(decoded.exp ? new Date(decoded.exp * 1000) : null);
    } catch {
      await logout();
    }
  };

  const logout = async () => {
    configureAuthorization(null);
    setUser(null);
    setStatus('UNAUTHENTICATED');
    setTokens(null);
    setExpiresAt(null);
    await backendLogout();
  };

  useEffect(() => {
    update();
  }, []);

  return (
    <SessionContext.Provider
      value={{ user, status, accessToken: tokens?.accessToken ?? null, expiresAt, update, logout }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
