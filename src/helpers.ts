import { ConfigService } from '@nestjs/config';
import { servicesAndEndpoints } from './constants';
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
          on: {
            proxyReq: (proxyRes, _, res) => {
              res.on('close', () => proxyRes.destroy());
            },
          },
        }),
      );
    });
  });
};
