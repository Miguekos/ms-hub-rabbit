import axios from 'axios';
import { HttpService } from '@nestjs/common';
import { OrderDTO } from "./order.dto";
import { OrderDocument, Order } from './order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


export class OrderClass {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>, 
        //private apiKey: 'fb878038-58a1-47da-953a-29d750fe1f9b'
    ) {}

    async getDetailStatus(statusID): Promise<object>{
        const apiKey = 'fb878038-58a1-47da-953a-29d750fe1f9b'
        const {data} = await axios({
            method: 'get',
            baseURL: 'https://api.mintsoft.co.uk',
            url: `/api/Order/Statuses?APIKey=${apiKey}&api_key=${apiKey}`
        })

        const detStatus = data.find(element => element.ID == statusID);
        console.log(detStatus)
        return detStatus
    }

    async getOrder(idOrder: number): Promise<object>{
        const apiKey = 'fb878038-58a1-47da-953a-29d750fe1f9b'
        const {data} = await axios({
            method: 'get',
            baseURL: 'https://api.mintsoft.co.uk',
            url: `/api/Order/${idOrder}?APIKey=${apiKey}&api_key=${apiKey}`
        })
        return data
    }

    async getIDStatus(idOrder: number): Promise<number>{
        const apiKey = 'fb878038-58a1-47da-953a-29d750fe1f9b'
        const {data} = await axios({
            method: 'get',
            baseURL: 'https://api.mintsoft.co.uk',
            url: `/api/Order/${idOrder}?APIKey=${apiKey}&api_key=${apiKey}`
        })
        console.log('ID STATUS ORDER:',data.OrderStatusId)
        return data.OrderStatusId
    }

    async updateOrder(ID: number, body: object): Promise<object>{
        console.log('UPDATE ORDER')
        console.log(ID)
        console.log(body)
        
        const upd = await this.orderModel.findOneAndUpdate({ID}, body).setOptions({new: true });
        return upd
    }
}
