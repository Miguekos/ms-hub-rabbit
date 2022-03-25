import { Controller, Post, Res, Body, HttpStatus, Get, Param, Inject, ParseIntPipe } from '@nestjs/common';
import { OrderService } from "./order.service";
import { OrderDTO } from './order.dto';

@Controller('order')
export class OrderController {
    constructor(
        private orderService: OrderService,
    ){}


    @Post('notify')
    async notify(@Res() res, @Body() orderDTO: OrderDTO){
        const notify= await this.orderService.newOrder(orderDTO)
        console.log(notify)
        res.status(HttpStatus.OK).json({
            message: 'OK',
            order: notify
        })

    }

    // @Get('getStatus/:idOrder')
    // async getClient(@Res() res, @Param('idOrder', ParseIntPipe) idOrder){
    //     console.log('STATUS ORDER')
    //     console.log(typeof(idOrder))
    //     const status = await this.orderService.processStatus(idOrder)
    //     res.status(HttpStatus.OK).json({
    //         message: 'OK',
    //         status: status
    //     })
    // }
}
