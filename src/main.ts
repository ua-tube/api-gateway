import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import { configureEndpointsProxy, configureWsProxy } from './helpers';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set('trust proxy', true);

  const configService = app.get(ConfigService);
  app.enableCors({
    origin: configService.getOrThrow<string>('CLIENT_URL').split(','),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
  app.disable('x-powered-by');

  configureEndpointsProxy(app, configService);
  configureWsProxy(app, configService);

  await app.listen(
    configService.get<number>('HTTP_PORT'),
    configService.get<string>('HTTP_HOST'),
  );
}
bootstrap().catch((err) => Logger.error(err));
