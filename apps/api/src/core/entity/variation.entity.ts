import { LineItem } from 'src/core/entity/line-items.entity';
import { Product } from 'src/core/entity/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('variations')
export class Variation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  variation_name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  sku: string; // Stock Keeping Unit (required for inventory)

  @Column({ type: 'varchar', length: 50, nullable: true })
  barcode: string; // For scanning at POS

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  unit_price: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  sale_price: number; // For temporary discounts

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  cost_price: number; // For profit calculation

  @Column({ type: 'varchar', length: 20 })
  unit_of_measurement: string; // e.g., "pieces", "kg", "liters"

  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
  weight: number; // For shipping calculations

  @Column({ type: 'varchar', length: 10, nullable: true })
  weight_unit: string; // "g", "kg", "lb"

  @Column({ type: 'int' })
  quantity: number; // Current stock level

  @Column({ type: 'int', default: 0 })
  low_stock_threshold: number; // Alert when stock reaches this level

  @Column({ type: 'boolean', default: true })
  is_active: boolean; // Soft delete/disable variations

  @Column({ type: 'boolean', default: false })
  is_default: boolean; // Mark default variation

  @Column({ type: 'jsonb', nullable: true })
  attributes: Record<string, any>; // For dynamic properties like color, size

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Corrected relationships:
  @ManyToOne(() => Product, (product) => product.variations, {
    onDelete: 'CASCADE',
  })
  @Index() // Now this is properly placed on the relationship
  product: Product;

  @OneToMany(() => LineItem, (lineItem) => lineItem.variation)
  line_items: LineItem[];
}
