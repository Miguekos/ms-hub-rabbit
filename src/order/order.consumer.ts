import { Injectable } from '@nestjs/common';
import { InjectAmqpConnection } from 'nestjs-amqp';
import { RabbitmqPublish } from "src/helpers/rabbitmq";
//import { OrderService } from './order.service';
import { OrderService } from 'src/order/order.service';
import { OrderDocument, Order } from './order.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { OrderClass } from './order';


@Injectable()
export class OrderConsumer {

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectAmqpConnection() private readonly amqp, 
    private rabbitmqPublish: RabbitmqPublish,
    private orderService: OrderService,
    private orderClass: OrderClass,
  ) {
     //this.consumerOrderAdd();
    //  this.consumerOrderStatus();
    // this.consumerOrderMDB();
  }

  async consumerOrderAdd() {
    const channel = await this.amqp.createChannel();
    const confirmChannel = await this.amqp.createConfirmChannel();
    confirmChannel.prefetch(1);
    const v = confirmChannel.consume('orderAdd_queue', async function (msg) {
      const dataJson= msg.content.toString()
      //const dataJson = JSON.parse(msg.content.toString()); 
      console.log('LOGICA DE REGISTRO DE ORDER')
      console.log(dataJson)
      await this.orderService.saveOrder(dataJson)
      confirmChannel.ack(msg);
    }, {
        noAck: false
        //noAck: true
    });
    console.log(v);
  }

  async consumerOrderStatus() {
    //const channel = await this.amqp.createChannel();
    const confirmChannel = await this.amqp.createConfirmChannel();
    confirmChannel.prefetch(1);
    const v= confirmChannel.consume('orderStatus_queue', async function  (msg) {
      console.log('LOGICA DE CONSULTA DE ESTADO')
      const dataJson= msg.content.toString()
      const IDOrder = dataJson.ID
      console.log(IDOrder)
      const status = await this.orderService.processStatus(IDOrder)
      console.log(status)

      confirmChannel.ack(msg);
                         
    }, {
        noAck: false
        //noAck: true
    });
    console.log(v);
  }
  
  async consumerOrderMDB() {
    const channel = await this.amqp.createChannel();
    const confirmChannel = await this.amqp.createConfirmChannel();
    confirmChannel.prefetch(1);
    const v = confirmChannel.consume('orderMDB_queue', async function (msg) {
      const dataJson= msg.content.toString()
      //const dataJson = JSON.parse(msg.content.toString()); 
      console.log('LOGICA DE REGISTRO DE ORDER')
      console.log(dataJson)
      const IDOrder = dataJson.ID
      const IDstatus = dataJson.OrderStatusId
      await this.orderService.updateOrderMDB(IDOrder, dataJson)

      switch (IDstatus) {
        case 3: // CANCELLED
        case 4: // DESPATCHED
            confirmChannel.ack(msg);
            break;

        default:
            await this.rabbitmqPublish.publishAMQP('ex_order_await', '',dataJson)
            confirmChannel.ack(msg);
            break;
    }

     // confirmChannel.ack(msg);
    }, {
        noAck: false
        //noAck: true
    });
    console.log(v);
  }

}
