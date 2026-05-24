import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { CreateOrderDto } from './dto/create-order.dto';

import { Product } from '../products/product.entity';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async createOrder(dto: CreateOrderDto) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const product = await manager.findOne(Product, {
          where: {
            id: dto.productId,
          },
          lock: {
            mode: 'pessimistic_write',
          },
        });

        if (!product) {
          throw new NotFoundException('Product not found');
        }

        if (product.stock < dto.quantity) {
          throw new BadRequestException('Stock is not enough');
        }

        // kurangi stock
        product.stock -= dto.quantity;

        await manager.save(Product, product);

        // buat order
        const order = manager.create(Order, {
          totalPrice: product.flashSalePrice * dto.quantity,
        });

        const savedOrder = await manager.save(Order, order);

        // buat order item
        const orderItem = manager.create(OrderItem, {
          order: savedOrder,
          product: product,
          quantity: dto.quantity,
          price: product.flashSalePrice,
        });

        await manager.save(OrderItem, orderItem);

        return {
          success: true,
          message: 'Order created successfully',
          data: {
            orderId: savedOrder.id,
            productId: product.id,
            productName: product.name,
            quantity: dto.quantity,
            totalPrice: savedOrder.totalPrice,
            remainingStock: product.stock,
          },
        };
      });
  } catch (error) {
  console.log('CREATE ORDER ERROR:', error);

  if (
    error instanceof BadRequestException ||
    error instanceof NotFoundException
  ) {
    throw error;
  }

  throw new InternalServerErrorException(
    error.message || 'Failed to create order',
  );
}
  }

 async findAll() {
  try {
    return await this.dataSource.manager.find(Order, {
      relations: ['items', 'items.product'],
    });
  } catch (error) {
    console.log(error);
    throw new InternalServerErrorException('Failed to get orders');
  }
}

async findOne(id: number) {
  try {
    const order = await this.dataSource.manager.findOne(Order, {
      where: { id },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  } catch (error) {
    console.log(error);

    if (error instanceof NotFoundException) {
      throw error;
    }

    throw new InternalServerErrorException('Failed to get order');
  }
}
}