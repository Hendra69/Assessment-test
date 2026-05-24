import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) {}

  // create order
  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return await this.ordersService.createOrder(
      createOrderDto,
    );
  }

  // get all orders
  @Get()
  async findAll() {
    return await this.ordersService.findAll();
  }

  // get order by id
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.ordersService.findOne(id);
  }
}