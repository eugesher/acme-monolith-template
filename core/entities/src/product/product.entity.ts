import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

import { ProductStatusEnum } from '@acme-libs/kernel';

@Entity({ name: 'product' })
export class Product {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  public readonly id: string;

  @Index('uq_product_sku', { unique: true })
  @Column({ type: 'varchar', length: 64 })
  public readonly sku: string;

  @Column({ type: 'varchar', length: 255 })
  public readonly name: string;

  @Column({ type: 'enum', enum: ProductStatusEnum, default: ProductStatusEnum.DRAFT })
  public readonly status: ProductStatusEnum;

  @VersionColumn({ default: 1 })
  public readonly version: number;

  @CreateDateColumn({ type: 'timestamp', precision: 0, default: () => 'CURRENT_TIMESTAMP' })
  public readonly createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  public readonly updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', precision: 0, nullable: true })
  public readonly deletedAt: Date | null;
}
