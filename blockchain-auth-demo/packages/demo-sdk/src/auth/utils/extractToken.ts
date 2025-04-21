import { BaseRequest, getHeaderValue, isHttps } from '../../utils/httpUtils';
import { getSessionCookieName } from '../utils/getSessionCookieName';

/**
 * Represents a base cookie.
 */
export interface BaseCookie {
  name: string;
  value: string;
}

/**
 * Represents a collection of cookies.
 */
export interface BaseCookies {
  /**
   * Retrieves a cookie by name or by a `BaseCookie` object.
   * @param args - The name of the cookie or a `BaseCookie` object.
   * @returns The matching `BaseCookie` object, or `undefined` if not found.
   */
  get(...args: [name: string] | [BaseCookie]): BaseCookie | undefined;
}

/**
 * Represents a cross-framework compatible request with cookies.
 */
export interface BaseRequestWithCookies extends BaseRequest {
  cookies: Record<string, string> | BaseCookies;
}

/**
 * Retrieves the value of a cookie by its name; compatible with several frameworks, i.e. native, Next.js, Express.
 *
 * @param cookies - The cookies object.
 * @param cookieName - The name of the cookie to retrieve.
 * @returns The value of the cookie, or `null` if the cookie does not exist.
 */
const getCookieValue = (cookies: BaseRequestWithCookies['cookies'], cookieName: string): string | null => {
  if ('get' in cookies && typeof cookies.get === 'function') {
    return cookies.get(cookieName)?.value ?? null;
  }

  return cookies[cookieName] ?? null;
};

/**
 * Extracts the token from the given request authorization or cookie.
 *
 * @param request - The request object containing the token.
 * @returns The extracted token or null if not found.
 */
export const extractToken = (request: BaseRequestWithCookies): string | null => {
  const bearer = getHeaderValue(request.headers, 'authorization')?.split(' ')[1];

  if (bearer) {
    return bearer;
  }

  const cookieName = getSessionCookieName(isHttps(request.headers));
  const cookieValue = getCookieValue(request.cookies, cookieName);
  return cookieValue ?? null;
};
