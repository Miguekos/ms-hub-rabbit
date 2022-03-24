import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AmqpModule } from 'nestjs-amqp';

@Module({
  imports: [
    AmqpModule.forRootAsync({
      useFactory: async () /*(configService: ConfigService)*/ => {
        return Promise.resolve({
          name: 'rabbitmq',
          hostname: '207.244.228.209',
          port: 30301,
          username: 'guest',
          password: 'guest',
        });
      },
      // inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  public async onModuleInit(): Promise<void> {
    console.log('MicroModule module init');
  }
}
