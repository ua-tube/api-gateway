import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set('trust proxy', true);

  const configService = app.get(ConfigService);
  app.enableCors({ origin: configService.getOrThrow<string>('CLIENT_URL') });

  const proxyConfigItems = new Map([
    ['community', configService.getOrThrow<string>('COMMUNITY_SVC_ORIGIN')],
    ['library', configService.getOrThrow<string>('LIBRARY_SVC_ORIGIN')],
    ['subscriptions', configService.getOrThrow<string>('SUBSCRIPTIONS_SVC_ORIGIN')],
    ['users', configService.getOrThrow<string>('USERS_SVC_ORIGIN')],
    ['video-manager', configService.getOrThrow<string>('VIDEO_MANAGER_SVC_ORIGIN')],
    ['video-processor', configService.getOrThrow<string>('VIDEO_PROCESSOR_SVC_ORIGIN')],
    ['video-store', configService.getOrThrow<string>('VIDEO_STORE_SVC_ORIGIN')],
  ])

  proxyConfigItems.forEach((value, key) => {
    app.use(`/api/${key}/health`,
      createProxyMiddleware({
        target: `${value}/api/v1/health`,
        changeOrigin: true
      }))
    app.use(`/api/${key}`,
      createProxyMiddleware({
        target: `${value}/api/v1/${key}`,
        changeOrigin: true,
      }))
  })

  await app.listen(
    configService.get<number>('HTTP_PORT'),
    configService.get<string>('HTTP_HOST'),
  );
}
bootstrap().catch(err => Logger.error(err));
