import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);
export const delimiter = ':';

/**
 * Hashes a string using scrypt and returns the result as a hash with the salt.
 */
export const hashWithScrypt = async (value: string): Promise<string> => {
  const salt = randomBytes(16).toString('hex');
  const hash = (await scryptAsync(value, salt, 64)) as Buffer;
  return `${salt}${delimiter}${hash.toString('hex')}`;
};

/**
 * Verifies a string against a hashed value.
 */
export const verifyWithScrypt = async (storedHash: string, value: string): Promise<boolean> => {
  const [salt, hash] = storedHash.split(delimiter);
  if (!salt || !hash) {
    return false;
  }
  const derivedHash = (await scryptAsync(value, salt, 64)) as Buffer;
  return hash === derivedHash.toString('hex');
};
