import {
  AuthUser,
  configureServices,
  DemoConfig,
  extractToken,
  fetchSessionUser,
  isDefined,
  verifyToken
} from '@demo/sdk';
import { NextRequest, NextResponse } from 'next/server';

interface AuthMiddlewareOptions {
  keyOrSecret: string;
  config: (request: NextRequest) => Pick<DemoConfig, 'appEnv' | 'appId'>;
  callback?: {
    beforeAuth?: ({ request }: { request: NextRequest }) => Promise<void> | void;
    afterAuth?: ({ request, user }: { request: NextRequest; user: AuthUser }) => Promise<void> | void;
    onResponse?: ({ request, user }: { request: NextRequest; user: AuthUser | null }) => NextResponse<unknown>;
  };
  loginPath?: ({ user }: { user: AuthUser | null }) => string | null;
  allowedPaths?: string[];
}

/**
 * Middleware to authenticate requests for Next.js applications.
 *
 * @param options - The options for the middleware.
 * @returns The middleware function.
 */
export const withAuthMiddleware = ({ keyOrSecret, config, callback, allowedPaths, loginPath }: AuthMiddlewareOptions) =>
  async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Set up services such as backend API
    configureServices(config(request));

    const onNextResponse = (user: AuthUser | null) => callback?.onResponse?.({ request, user }) ?? NextResponse.next();

    // Adjust allowed paths
    const allowedPathGroups = allowedPaths
      // Ignore trailing slashes
      ?.map((path) => path.replace(/\/$/, ''))
      .filter(isDefined)
      // Handle wildcard paths
      .reduce<{ static: string[]; wildcards: string[] }>(
        (acc, path) => {
          const isWildcard = path.endsWith('/*');
          const allowPath = isWildcard ? path.slice(0, -2) : path;
          acc[isWildcard ? 'wildcards' : 'static'].push(allowPath);
          return acc;
        },
        { static: [], wildcards: [] }
      );

    // Allow requests to paths that are not protected
    if (
      allowedPathGroups?.static.includes(pathname.replace(/\/$/, '')) ||
      allowedPathGroups?.wildcards.some((path) => pathname.startsWith(path))
    ) {
      try {
        const token = extractToken(request);
        const user = await fetchSessionUser(token);
        return onNextResponse(user);
      } catch {
        return onNextResponse(null);
      }
    }

    try {
      // Execute pre-authentication hook; may throw error to prevent access
      await callback?.beforeAuth?.({ request });

      // Extract token from header or cookie
      const token = extractToken(request);

      if (!token) {
        throw new Error('Token not found');
      }

      // Validate token has been signed by the server
      await verifyToken(token, keyOrSecret);

      // Retrieve additional session details from the backend
      const user = await fetchSessionUser(token);

      // Optional: Ensure user has minimum role access here

      // Execute post-authentication hook; may throw error to prevent access
      await callback?.afterAuth?.({ request, user });

      return onNextResponse(user);
    } catch (error) {
      console.error(error);
    }

    // Determine login path
    const login = await (async () => {
      const path =
        loginPath?.({
          user: await (async () => {
            try {
              const token = extractToken(request);
              return await fetchSessionUser(token);
            } catch {
              return null;
            }
          })()
        }) || '/login';

      return path;
    })();

    // Default redirection to login
    if (!pathname.startsWith(login) && pathname !== '/') {
      const loginUrl = new URL(login, request.url);
      loginUrl.searchParams.set('redirect', request.url);
      return NextResponse.redirect(loginUrl);
    }

    return onNextResponse(null);
  };
