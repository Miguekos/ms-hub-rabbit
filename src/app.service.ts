import { Injectable, Body } from '@nestjs/common';

import { InjectAmqpConnection } from 'nestjs-amqp';
import {} from 'amqplib';

@Injectable()
export class AppService {
  constructor(@InjectAmqpConnection() private readonly amqp) {
    // this.startConnect();
    this.startConnectConsumer();
  }

  getHello(): string {
    return 'Hello World!';
  }

  async startConnect() {
    const channel = await this.amqp.createChannel();
    const confirmChannel = await this.amqp.createConfirmChannel();
    // console.warn(confirmChannel);
    const assert = await confirmChannel.assertQueue('my_queue', {
      durable: false,
    });
    // console.log(assert);
    const sent = await confirmChannel.publish(
      '',
      'my_queue',
      Buffer.from(JSON.stringify({ name: 'Miguel' })),
      (error, ok) => {
        if (error) {
          console.log('Message dropped!');
        } else {
          console.log('Message OK');
        }
      },
    );
    // const sent = await confirmChannel.publish('', 'my_queue', {
    //   pattern: 'any_event',
    //   data: 'Record',
    // });
    // console.log(sent);
    // await channel.publish(
    //   'amq.topic',
    //   'my_queue',
    //   new Buffer(JSON.stringify({ hello: 'dung' })),
    //   { persistent: true },
    //   () => {},
    // );
  }

  async startConnectConsumer() {
    const channel = await this.amqp.createChannel();
    const confirmChannel = await this.amqp.createConfirmChannel();
    // console.warn(confirmChannel);
    const assert = await confirmChannel.assertQueue('my_queue', {
      durable: false,
    });
    // console.log(assert);
    confirmChannel.consume(
      'my_queue',
      function (msg) {
        console.log(
          "[x] %s: '%s'",
          msg.fields.routingKey,
          msg.content.toString(),
        );
      },
      {
        noAck: true,
      },
    );
  }

  async publishPost(queue: string, body: any) {
    console.log('queue', queue);

    const channel = await this.amqp.createChannel();
    const confirmChannel = await this.amqp.createConfirmChannel();
    // console.warn(confirmChannel);
    const assert = await confirmChannel.assertQueue(queue, {
      durable: false,
    });
    console.log('assert', assert);
    await channel.publish(
      '',
      queue,
      Buffer.from(JSON.stringify(body)),
      { persistent: true },
      (error, ok) => {
        // console.log('ok', ok);
        if (error) {
          console.log('Message dropped!');
        } else {
          console.log('Message OK');
        }
      },
    );
  }
}
