import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { OrderProduct } from '../order/order-product.entity';
import { Product } from './product.entity';

@Entity({ name: 'product_stock' })
@Index('idx_product_stock_product', ['productId', 'quantity'])
export class ProductStock {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  public readonly id: string;

  @Column({ type: 'bigint', unsigned: true })
  public readonly productId: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id', foreignKeyConstraintName: 'fk_product_stock_product' })
  public readonly product: Product;

  @Column({ type: 'int' })
  public readonly quantity: number;

  @Index('uq_product_stock_order_product', { unique: true })
  @Column({ type: 'bigint', unsigned: true, nullable: true })
  public readonly orderProductId: string | null;

  @ManyToOne(() => OrderProduct, { nullable: true })
  @JoinColumn({
    name: 'order_product_id',
    foreignKeyConstraintName: 'fk_product_stock_order_product',
  })
  public readonly orderProduct: OrderProduct | null;

  @CreateDateColumn({ type: 'timestamp', precision: 0, default: () => 'CURRENT_TIMESTAMP' })
  public readonly createdAt: Date;
}
