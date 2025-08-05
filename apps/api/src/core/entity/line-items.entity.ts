import { Sale } from 'src/core/entity/sale.entity';
import { Variation } from 'src/core/entity/variation.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('line_items')
export class LineItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  unit_price: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  discount_amount: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  tax_amount: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  total_price: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Variation, (variation) => variation.line_items, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @Index()
  variation: Variation | null;

  @ManyToOne(() => Sale, (sale) => sale.line_items, {
    onDelete: 'CASCADE', // Delete line items when sale is deleted
  })
  @Index()
  sale: Sale;

  // Business logic methods
  calculateTotal(): number {
    return (
      this.unit_price * this.quantity - this.discount_amount + this.tax_amount
    );
  }
}
