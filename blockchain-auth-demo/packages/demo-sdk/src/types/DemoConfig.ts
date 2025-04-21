import { AppId } from './AppId';
import { DemoEnvironment } from './DemoEnvironment';

/**
 * Represents the configuration options for the Demo SDK.
 */
export interface DemoConfig {
  /**
   * The environment associated with the app.
   */
  readonly appEnv: DemoEnvironment;

  /**
   * The url associated with API requests.
   *
   * If not provided, will derive from `appId`.
   */
  readonly apiUrl?: string;

  /**
   * The app associated with the app.
   */
  readonly appId: AppId;

  /**
   * The version of the app associated with the app.
   */
  readonly appVersion?: string;

  /**
   * The cookies to attach to each request.
   */
  readonly cookies?: string;
}
