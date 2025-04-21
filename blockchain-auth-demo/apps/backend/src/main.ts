import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    bufferLogs: true
  });

  // Setup global pipes for validation and transformation before route handling
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true
    })
  );

  // Setup security middlewares before request processing takes place
  app.use(helmet());
  app.use(cookieParser());
  app.useBodyParser('json', { limit: '5mb' });

  // Enable CORS before defining routes to ensure all responses have CORS headers
  app.enableCors({
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200
  });

  // Update payload limits for incoming requests
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  // Configure versioning prior to controller and route configuration
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  await app.listen(process.env.PORT ?? 3000);
  Logger.log(`Nest application running on ${await app.getUrl()}`, 'NestApplication');
}

bootstrap();
