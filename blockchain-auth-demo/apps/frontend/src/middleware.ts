import { config as appConfig } from '@/app.config';
import { withAuthMiddleware } from '@demo/sdk-next';

export default withAuthMiddleware({
  keyOrSecret: appConfig.authJwtPublicKey,
  config: () => ({
    appEnv: appConfig.environment,
    appId: appConfig.appId
  }),
  allowedPaths: ['/']
});

export const config = {
  // Declare all paths to execute middleware
  matcher: ['/((?!_next/static|_next/image|images|favicon.ico).*)']
};
