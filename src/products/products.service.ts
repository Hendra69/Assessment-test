import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create({
        name: createProductDto.name,
        price: createProductDto.price,
        flashSalePrice: createProductDto.flashSalePrice,
        stock: createProductDto.stock,
      });

      return await this.productRepository.save(product);
    } catch (error) {
      console.log('CREATE PRODUCT ERROR:', error);

      throw new InternalServerErrorException(
        error.message || 'Failed to create product',
      );
    }
  }

  async findAll() {
    try {
      return await this.productRepository.find({
        order: {
          id: 'ASC',
        },
      });
    } catch (error) {
      console.log('GET PRODUCTS ERROR:', error);

      throw new InternalServerErrorException(
        error.message || 'Failed to get products',
      );
    }
  }

  async findOne(id: number) {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      return product;
    } catch (error) {
      console.log('GET PRODUCT DETAIL ERROR:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        error.message || 'Failed to get product',
      );
    }
  }

  async updateStock(id: number, stock: number) {
    try {
      if (stock < 0) {
        throw new BadRequestException('Stock cannot be negative');
      }

      const product = await this.findOne(id);

      product.stock = stock;

      return await this.productRepository.save(product);
    } catch (error) {
      console.log('UPDATE PRODUCT STOCK ERROR:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        error.message || 'Failed to update product stock',
      );
    }
  }
}