import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { AppController } from './app.controller';
import {
  ThrottlerGuard,
  ThrottlerModule,
} from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.valid('development', 'production', 'test').required(),
        CLIENT_URL: Joi.string().required(),
        HTTP_HOST: Joi.string().required(),
        HTTP_PORT: Joi.number().required(),
        COMMUNITY_SVC_ORIGIN: Joi.string().uri(),
        LIBRARY_SVC_ORIGIN: Joi.string().uri(),
        SUBSCRIPTIONS_SVC_ORIGIN: Joi.string().uri(),
        USERS_SVC_ORIGIN: Joi.string().uri(),
        VIDEO_MANAGER_SVC_ORIGIN: Joi.string().uri(),
        VIDEO_STORE_SVC_ORIGIN: Joi.string().uri(),
        HISTORY_SVC_ORIGIN: Joi.string().uri(),
        SEARCH_SVC_ORIGIN: Joi.string().uri(),
      }),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 1000,
        limit: 3,
        ignoreUserAgents: [/google/, /bing/],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
