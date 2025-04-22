import { UserService } from '@/api/users/user.service';
import { AppConfig } from '@/app.config';
import { hashWithScrypt } from '@/utils/hashScrypt';
import {
  AuthUser,
  extractDomain,
  getHostUrl,
  getSessionCookieName,
  isHttps,
  toAuthUser,
  User,
  verifyToken
} from '@demo/sdk';
import { Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { CookieOptions, Request, Response } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly config: AppConfig,
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async signup({ name, email, password }: CreateUserDto): Promise<User> {
    const normalizedEmail = email.toLowerCase();
    const exists = await this.userService.findByEmail(normalizedEmail);

    if (exists) {
      this.logger.warn('User already exists');
      throw new Error('An error occurred while signing up');
    }

    const hash = await hashWithScrypt(password);

    const user: User = {
      id: randomUUID(),
      name,
      email: normalizedEmail,
      password: hash,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.userService.create(user);
    return user;
  }

  /**
   * Finds session associated with the user.
   */
  async findSessionUser(token: string | null): Promise<AuthUser> {
    const decode = await verifyToken(token, this.config.authJwtPublicKey);

    if (!decode.sub) {
      this.logger.error('No profile identifier found in session payload');
      throw new UnauthorizedException();
    }

    const user = await this.userService.findById(decode.sub);

    if (!user) {
      this.logger.error('User not found');
      throw new UnauthorizedException();
    }

    return toAuthUser(user);
  }

  /**
   * Creates a session for the user.
   */
  async createSession(
    userId: string,
    request: Request,
    response: Response
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    this.logger.debug('Begin creating session management...');

    const tokens = await this.createTokens(userId);
    const cookie = this.createCookie(request);

    if (!cookie) {
      this.logger.error('Cookie could not be created for session management');
      throw new InternalServerErrorException();
    }

    // Store tokens in user cookies
    response.cookie(cookie.name, tokens.accessToken, cookie.options);
    response.cookie(`${cookie.name}-refresh`, tokens.refreshToken, cookie.options);

    this.logger.debug('Cookie session successfully completed');
    return tokens;
  }

  /**
   * Create access and refresh tokens to be used for authorized requets.
   */
  private async createTokens(userId: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload = {
      id: userId,
      sub: userId
    } satisfies JwtPayload;

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(
        {
          id: payload.id,
          sub: payload.sub
        },
        {
          privateKey: Buffer.from(this.config.authJwtRefreshPrivateKey, 'base64').toString('utf-8'),
          expiresIn: this.config.authJwtRefreshExpiresIn // Longer expiry to exchange for fresh token later
        }
      )
    };
  }

  /**
   * Creates a cookie for the given request.
   */
  private createCookie(request: Request): {
    name: string;
    options: CookieOptions;
  } | null {
    const url = getHostUrl(request.headers);
    this.logger.debug(`Begin creating cookie for URL: ${url}`);

    if (!url) {
      return null;
    }

    const domain = extractDomain(url) ?? undefined;
    const useSecureCookies = isHttps(request.headers);
    this.logger.debug(`Constructed domain for cookie: ${domain}`);

    return {
      name: getSessionCookieName(useSecureCookies),
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies,
        ...(useSecureCookies ? { domain } : null)
      } satisfies CookieOptions
    };
  }

  logout(request: Request, response: Response) {
    const secured = isHttps(request.headers);
    const cookieName = getSessionCookieName(secured);
    const refreshCookieName = getSessionCookieName(secured, 'refresh');

    response.clearCookie(cookieName);
    response.clearCookie(refreshCookieName);
  }
}
