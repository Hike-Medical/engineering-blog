import { UserService } from '@/api/users/user.service';
import { AppConfig } from '@/app.config';
import { extractToken, toAuthUser, verifyToken } from '@demo/sdk';
import { Injectable, Logger, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { errors } from 'jose';

/**
 * Middleware that authenticates the request against the provided context.
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  constructor(private readonly config: AppConfig, private readonly userService: UserService) {}

  async use(request: Request, _response: Response, next: NextFunction) {
    // Validate token belongs to company if provided
    try {
      const token = extractToken(request);
      const decode = await verifyToken(token, this.config.authJwtPublicKey);

      if (!decode.sub) {
        throw new errors.JWTInvalid('Token type invalid');
      }

      const user = await this.userService.findById(decode.sub);

      if (!user) {
        throw new errors.JWTInvalid('User not found');
      }

      request.user = toAuthUser(user); // Attach user to request
      return next();
    } catch (error) {
      this.logger.warn(error);
      throw new UnauthorizedException();
    }
  }
}
