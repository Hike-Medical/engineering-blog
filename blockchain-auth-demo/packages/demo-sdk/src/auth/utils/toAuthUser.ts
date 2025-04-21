import { User } from '../../types/User';
import { AuthUser } from '../types/AuthUser';

export const toAuthUser = (user: User): AuthUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});
