import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AmqpModule } from 'nestjs-amqp';
import { OrderModule } from './order/order.module';
import { MongooseModule, InjectModel } from '@nestjs/mongoose'

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://95.111.235.214:32768/multivende_dev'),
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
    OrderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  public async onModuleInit(): Promise<void> {
    console.log('MicroModule module init');
  }
}
