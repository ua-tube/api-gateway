import { ConfigService } from '@nestjs/config';
import { servicesAndEndpoints, servicesAndWs } from './constants';
import { NestExpressApplication } from '@nestjs/platform-express';
import { createProxyMiddleware } from 'http-proxy-middleware';

export const configureEndpointsProxy = (
  app: NestExpressApplication,
  configService: ConfigService,
) => {
  servicesAndEndpoints.forEach((item) => {
    item[1].forEach((coreRoute) => {
      app.use(
        `/api/${coreRoute}`,
        createProxyMiddleware({
          target: `${configService.getOrThrow<string>(item[0])}/api/v1/${coreRoute}`,
          changeOrigin: true,
        }),
      );
    });
  });
};

export const configureWsProxy = (
  app: NestExpressApplication,
  configService: ConfigService,
) => {
  servicesAndWs.forEach((item) => {
    app.use(
      item[1],
      createProxyMiddleware({
        target: `${configService.getOrThrow<string>(item[0])}${item[1]}`,
        changeOrigin: true,
        ws: true,
      }),
    );
  });
};
