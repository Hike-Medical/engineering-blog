import { UserService } from '@/api/users/user.service';
import { AppConfig } from '@/app.config';
import { AuthUser, getSessionCookieName, isHttps, toAuthUser } from '@demo/sdk';
import { applyDecorators, Injectable, Logger, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * Represents a request object the JWT refresh strategy will return.
 */
export interface JwtRefreshStrategyRequest extends Request {
  user: AuthUser;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  private readonly logger = new Logger(JwtRefreshStrategy.name);

  constructor(readonly config: AppConfig, private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromBodyField('token'),
        (request) => request?.cookies[getSessionCookieName(isHttps(request), 'refresh')]
      ]),
      secretOrKey: Buffer.from(config.authJwtRefreshPublicKey, 'base64').toString('utf-8'),
      algorithms: ['ES256']
    });

    this.logger.debug('JWT refresh strategy has been initialized');
  }

  async validate(payload: JwtPayload): Promise<JwtRefreshStrategyRequest['user']> {
    // Passport has successfully decoded and verified the token already,
    // otherwise an error would have thrown before reaching this point
    this.logger.debug('Begin validating refresh access token...');

    if (!payload.sub) {
      this.logger.error('No profile identifier found in refresh token payload');
      throw new UnauthorizedException();
    }

    const user = await this.userService.findById(payload.sub);

    if (!user) {
      this.logger.error('User not found');
      throw new UnauthorizedException();
    }

    this.logger.debug('Validate refresh access token successfully completed');
    return toAuthUser(user);
  }
}

/**
 * Refreshing JWT access strategy.
 */
export function JwtRefreshAuthStrategy() {
  return applyDecorators(UseGuards(AuthGuard('jwt-refresh')));
}
