import { ConfigService } from '@nestjs/config';
import { serviceAndEnvNameKeyPair } from './constants';
import { NestExpressApplication } from '@nestjs/platform-express';
import { createProxyMiddleware } from 'http-proxy-middleware';

export const configureEndpointsProxy = (
  app: NestExpressApplication,
  configService: ConfigService,
) => {
  const proxyItems = serviceAndEnvNameKeyPair.map((keys) => [
    keys[0],
    configService.getOrThrow<string>(keys[1]),
  ]);

  proxyItems.forEach((keys) => {
    app.use(
      `/api/${keys[0]}/health`,
      createProxyMiddleware({
        target: `${keys[1]}/api/v1/health`,
        changeOrigin: true,
      }),
    );
    app.use(
      `/api/${keys[0]}`,
      createProxyMiddleware({
        target: `${keys[1]}/api/v1/${keys[0]}`,
        changeOrigin: true,
      }),
    );
  });
};
