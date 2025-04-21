import { UserModule } from '@/api/users/user.module';
import { AppConfigModule } from '@/app.config';
import { AuthModule } from '@/auth/auth.module';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

@Module({
  imports: [AppConfigModule, AuthModule, UserModule]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(...['auth'].map((route) => `/v1/${route}/*path`))
      .forRoutes('*');
  }
}
