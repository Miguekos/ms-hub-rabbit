import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('send')
  async send(): Promise<string> {
    this.appService.startConnect();
    return 'Sending!!!';
  }

  @Post('send/:queue')
  async sendPost(
    @Body() body: string,
    @Param('queue') queue: string,
  ): Promise<string> {
    this.appService.publishPost(queue, body);
    return 'POST Sending!!!';
  }
}
