import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/api/gateway/health')
  ping(): string {
    return 'pong';
  }
}
