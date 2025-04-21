import { AuthUser } from '@demo/sdk';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator that extracts the user object of the caller.
 */
export const User = createParamDecorator((data: keyof AuthUser, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return data ? request.user?.[data] : request.user;
});
