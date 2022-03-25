import {Injectable, Logger} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { OrderDTO } from "./order.dto";
import { Order, OrderDocument } from "./order.schema";
import { RabbitmqPublish } from "src/helpers/rabbitmq";
import { OrderClass } from './order';
import { InjectAmqpConnection } from 'nestjs-amqp';


@Injectable()
export class OrderService {
    constructor (
        @InjectAmqpConnection() private readonly amqp,
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
        private orderClass: OrderClass,
        private rabbitmqPublish: RabbitmqPublish,
    ) {
        this.consumerOrderAdd();
        this.consumerOrderMDB();
        this.consumerOrderStatus();
    }
  
    async consumerOrderAdd() {
        const channel = await this.amqp.createChannel();
        const confirmChannel = await this.amqp.createConfirmChannel();
        confirmChannel.prefetch(1);
        const v = confirmChannel.consume('orderAdd_queue', async function (msg) {
        const dataJson= msg.content.toString()
        console.log('LOGICA DE REGISTRO DE ORDER')
        console.log(dataJson)
        const orderMDB = await confirmChannel.publish('ex_order_mdb', '',Buffer.from(dataJson))
        //const orderMDB = await this.rabbitmqPublish.publishAMQP('ex_order_mdb',dataJson)
        console.log(orderMDB)

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
            const dataJson= JSON.parse(msg.content.toString())
            //const dataJson = JSON.parse(msg.content.toString()); 
            console.log('LOGICA DE MDB DE ORDER')
            console.log(dataJson)
            const IDOrder = dataJson.ID
            const IDstatus = dataJson.OrderStatusId
            //await this.orderService.updateOrderMDB(IDOrder, dataJson)
            // await this.orderClass.updateOrder()
            // const upd = await this.orderModel.findOneAndUpdate({idOrder:IDOrder}, dataJson).setOptions({new: true });
            // console.log(upd)
        
            switch (IDstatus) {
                case 3: // CANCELLED
                case 4: // DESPATCHED
                    confirmChannel.ack(msg);
                    break;
        
                default:
                    const orderAwait = await confirmChannel.publish('ex_order_await', '',Buffer.from(JSON.stringify(dataJson)))
                    console.log(orderAwait)
                    //await this.rabbitmqPublish.publishAMQP('ex_order_await', '',dataJson)
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

    async consumerOrderStatus() {
        //const channel = await this.amqp.createChannel();
        const confirmChannel = await this.amqp.createConfirmChannel();
        confirmChannel.prefetch(1);
        const v= confirmChannel.consume('orderStatus_queue', async function  (msg) {
          console.log('LOGICA DE CONSULTA DE ESTADO')
          const dataJson= JSON.parse(msg.content.toString())
          const IDOrder = dataJson.ID
          console.log(IDOrder)
        //   const status = await this.orderService.processStatus(IDOrder)
        //   console.log(status)
        //  await this.rabbitmqPublish.publishAMQP('ex_order_mdb',body)
    
        // const IDstatus = await this.orderClass.getIDStatus(IDOrder);
        // const detailStatus = await this.orderClass.getDetailStatus(IDstatus);

        // const body = {
        //     OrderStatusId: IDstatus,
        //     detailStatus: detailStatus
        // }

        const orderAwait = await confirmChannel.publish('ex_order_mdb', '',Buffer.from(JSON.stringify(dataJson)))
        console.log(orderAwait)
        
          confirmChannel.ack(msg);
                             
        }, {
            noAck: false
            //noAck: true
        });
        console.log(v);
    }


    async newOrder(orderDTO: OrderDTO):Promise<Order>{
        const ord = await new this.orderModel(orderDTO)
        await ord.save()
        const mq = await this.rabbitmqPublish.publishAMQP('ex_order',orderDTO)
        console.log(mq)
        return ord
    }

    async saveOrder(orderDTO: OrderDTO):Promise<string>{
        console.log('AQUI VA EL SERVICIO DE REGISTRO DE ORDER')
        const orderAwait = await this.rabbitmqPublish.publishAMQP('ex_order_mdb',orderDTO)
        console.log(orderAwait)
        return 'OK'
    }
    
    // async updateOrderMDB(idOrder, body): Promise<object>{
    //     const upd = await this.orderModel.findOneAndUpdate({idOrder}, body).setOptions({new: true });
    //     console.log(upd)
    //     return upd
    // }

    // async processStatus(idOrder : number): Promise<object>{
    //     const IDstatus = await this.orderClass.getIDStatus(idOrder);
    //     const detailStatus = await this.orderClass.getDetailStatus(IDstatus);

    //     const body = {
    //         OrderStatusId: IDstatus,
    //         detailStatus: detailStatus
    //     }
    //     await this.rabbitmqPublish.publishAMQP('ex_order_mdb',body)
    //     return detailStatus
    // }
}
