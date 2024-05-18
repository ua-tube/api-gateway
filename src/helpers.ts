import { ConfigService } from '@nestjs/config';
import { serviceNames } from './constants';
import { NestExpressApplication } from '@nestjs/platform-express';
import { createProxyMiddleware } from 'http-proxy-middleware';

export const configureEndpointsProxy = (
  app: NestExpressApplication,
  configService: ConfigService,
) => {
  const proxyItems = new Map(serviceNames.map((name): [string, string] => [
    name,
    configService.getOrThrow<string>(`${name.toUpperCase().replaceAll('-', '_')}_SVC_ORIGIN`),
  ]));

  proxyItems.forEach((serviceOrigin, serviceName) => {
    app.use(
      `/api/${serviceName}/health`,
      createProxyMiddleware({
        target: `${serviceOrigin}/api/v1/health`,
        changeOrigin: true,
      }),
    );
    app.use(
      `/api/${serviceName}`,
      createProxyMiddleware({
        target: `${serviceOrigin}/api/v1/${serviceName}`,
        changeOrigin: true,
      }),
    );
  });
};
