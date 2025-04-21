export interface AuthUser {
  id: string;
  name?: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Type guard for determining whether a value is an authenticated user.
 */
export const isAuthUser = (value: unknown): value is AuthUser =>
  typeof value === 'object' &&
  value !== null &&
  'id' in value &&
  typeof value.id === 'string' &&
  'createdAt' in value &&
  'updatedAt' in value;
