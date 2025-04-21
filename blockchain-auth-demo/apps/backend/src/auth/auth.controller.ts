import { AuthSession, AuthUser, extractToken, getHostUrl, toAuthUser, toURL } from '@demo/sdk';
import { Body, Controller, Get, Logger, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtRefreshAuthStrategy, JwtRefreshStrategyRequest } from './strategies/jwt-refresh.strategy';
import { PasswordAuthStrategy, PasswordStrategyRequest } from './strategies/password.strategy';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: CreateUserDto, @Req() req: Request, @Res() res: Response) {
    const user = await this.authService.signup(body);
    const authUser = toAuthUser(user);
    const redirectUrl = this.redirectUrl(req);
    return await this.login(authUser, redirectUrl, req, res);
  }

  @Post('login')
  @PasswordAuthStrategy()
  async passwordLogin(@Req() req: PasswordStrategyRequest, @Res() res: Response) {
    const redirectUrl = this.redirectUrl(req);
    return await this.login(req.user, redirectUrl, req, res);
  }

  @Post('refresh')
  @JwtRefreshAuthStrategy()
  async refreshToken(@Req() req: JwtRefreshStrategyRequest, @Res() res: Response) {
    return await this.login(req.user, null, req, res);
  }

  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    this.authService.logout(req, res);
    return res.status(200).send();
  }

  @Get('session')
  async findSessionUser(@Req() request: Request) {
    try {
      const token = extractToken(request);
      return await this.authService.findSessionUser(token);
    } catch (error) {
      this.logger.debug(error);
      throw new UnauthorizedException();
    }
  }

  /**
   * Logs in a user and creates a session.
   *
   * @param user - The user to log in.
   * @param redirectUrl - The URL to redirect to after login (optional).
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @returns If a redirect URL is provided, redirects to the URL. Otherwise, returns the session tokens.
   */
  private async login(user: AuthUser, redirectUrl: string | null, @Req() req: Request, @Res() res: Response) {
    this.logger.debug('Begin creating session management for login...');
    const tokens = await this.authService.createSession(user, req, res);
    this.logger.debug('Create session for login successfully completed');

    if (redirectUrl) {
      this.logger.debug(`Redirecting after login: ${redirectUrl}`);
      res.redirect(redirectUrl);
      return null;
    }

    this.logger.debug('No redirect URL supplied for login, providing session details instead');
    const session = { user, tokens } satisfies AuthSession;
    return res.status(200).send(session);
  }

  /**
   * Retrieves the redirect URL from the request query parameters.
   */
  private redirectUrl(req: Request): string | null {
    const hostUrl = getHostUrl(req.headers);
    const url = toURL(`${hostUrl}${req.originalUrl}`);
    return url?.searchParams.get('redirect') ?? null;
  }
}
