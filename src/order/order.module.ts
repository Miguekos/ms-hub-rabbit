import { Module, HttpModule } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order, OrderSchema } from "./order.schema";
import { RabbitmqPublish } from "src/helpers/rabbitmq";
import { OrderConsumer } from "./order.consumer";
import { MongooseModule, InjectModel } from '@nestjs/mongoose';
import { OrderClass } from './order';
import { ConfigModule, ConfigService } from 'nestjs-config';
import * as path from 'path';
import { AmqpModule } from 'nestjs-amqp';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Order.name, schema: OrderSchema}
    ]),
    ConfigModule.load(path.resolve(__dirname, 'config', '../config/rabbitmq.ts')),
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
    // AmqpModule.forRootAsync({
    //     useFactory: (config: ConfigService) => config.get('rabbitmq'),
    //     inject: [ConfigService],
    // }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderClass, RabbitmqPublish, OrderConsumer],
  exports: [OrderService, OrderClass]
})
export class OrderModule {}
