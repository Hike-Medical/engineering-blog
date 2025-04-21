import { Global, Injectable, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * Represents the configuration for the application.
 */
@Injectable()
export class AppConfig {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Gets the auth JWT private key from the configuration.
   */
  get authJwtPrivateKey(): string {
    return this.configService.getOrThrow('AUTH_JWT_PRIVATE_KEY');
  }

  /**
   * Gets the auth JWT public key from the configuration.
   */
  get authJwtPublicKey(): string {
    return this.configService.getOrThrow('AUTH_JWT_PUBLIC_KEY');
  }

  /**
   * Gets the auth JWT expiries in seconds from the configuration.
   */
  get authJwtExpiresIn(): number {
    // TODO: Change to 5 minutes once refresh tokens thourough
    return 15 * 60; // 15 minutes
  }

  /**
   * Gets the auth refresh JWT private key from the configuration.
   */
  get authJwtRefreshPrivateKey(): string {
    return this.configService.getOrThrow('AUTH_JWT_REFRESH_PRIVATE_KEY');
  }

  /**
   * Gets the auth refresh JWT public key from the configuration.
   */
  get authJwtRefreshPublicKey(): string {
    return this.configService.getOrThrow('AUTH_JWT_REFRESH_PUBLIC_KEY');
  }

  /**
   * Gets the auth refresh JWT expiries in seconds from the configuration.
   */
  get authJwtRefreshExpiresIn(): number {
    return 30 * 24 * 60 * 60; // 30 days
  }
}

/**
 * Used for registering the `AppConfig` as a globally.
 */
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      // Enable nested .env files in monorepo
      expandVariables: true
    })
  ],
  providers: [AppConfig, ConfigService],
  exports: [AppConfig]
})
export class AppConfigModule {}
