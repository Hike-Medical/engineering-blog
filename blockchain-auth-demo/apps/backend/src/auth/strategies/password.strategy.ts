import { UserService } from '@/api/users/user.service';
import { verifyWithScrypt } from '@/utils/hashScrypt';
import { AuthUser, toAuthUser } from '@demo/sdk';
import {
  applyDecorators,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { Strategy } from 'passport-local';

/**
 * Represents a request object the password strategy will return.
 */
export interface PasswordStrategyRequest extends Request {
  user: AuthUser;
}

@Injectable()
export class PasswordStrategy extends PassportStrategy(Strategy, 'password') {
  private readonly logger = new Logger(PasswordStrategy.name);

  constructor(private readonly userService: UserService) {
    super({ usernameField: 'email' });
    this.logger.debug('Password strategy has been initialized');
  }

  async validate(email: string, password: string): Promise<PasswordStrategyRequest['user']> {
    this.logger.debug('Begin validating password...');

    const user = await this.userService.findByEmail(email.toLowerCase());

    if (!user || !password || !user.password) {
      throw new NotFoundException('No associated user could not be found or created for password login');
    }

    // Passwords are hashed during signup before persisting to storage
    const validPassword = await verifyWithScrypt(user.password, password);

    if (!validPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    this.logger.debug('Validate password successfully completed');
    return toAuthUser(user);
  }
}

/**
 * Authentication with user name and password.
 */
export function PasswordAuthStrategy() {
  return applyDecorators(UseGuards(AuthGuard('password')));
}
