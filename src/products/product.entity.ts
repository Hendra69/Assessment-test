import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column({
    name: 'flash_sale_price',
  })
  flashSalePrice: number;

  @Column()
  stock: number;
}