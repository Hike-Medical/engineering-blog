import { UserModule } from '@/api/users/user.module';
import { AppConfig } from '@/app.config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { PasswordStrategy } from './strategies/password.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [AppConfig],
      useFactory: (config: AppConfig) => ({
        // Decode config since keys were base64 encoded for storage
        privateKey: Buffer.from(config.authJwtPrivateKey, 'base64').toString('utf-8'),
        publicKey: Buffer.from(config.authJwtPublicKey, 'base64').toString('utf-8'),
        signOptions: {
          algorithm: 'ES256',
          expiresIn: config.authJwtExpiresIn
        }
      })
    }),
    UserModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtRefreshStrategy, PasswordStrategy],
  exports: [AuthService]
})
export class AuthModule {}
