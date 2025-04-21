import { AppId, DemoEnvironment } from '@demo/sdk';

/**
 * Represents the configuration for the application.
 */
export const config = {
  /**
   * Gets the auth JWT public key from the configuration.
   */
  authJwtPublicKey: process.env.AUTH_JWT_PUBLIC_KEY as string,

  /**
   * Gets the Demo environment of the app.
   */
  environment: (process.env.NEXT_PUBLIC_DEMO_ENV || process.env.NODE_ENV) as DemoEnvironment,

  /**
   * Gets the ID of the app.
   */
  appId: '@demo/frontend' as AppId,

  /**
   * Gets the version of the app from the configuration.
   */
  appVersion: '1.0.0'
};
