import { LineItem } from 'src/core/entity/line-items.entity';
import { User } from 'src/core/entity/user.entity';
import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  invoice_number: string; // Auto-generated invoice number

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  subtotal: number; // Before tax and discounts

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  tax_amount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  discount_amount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  total_amount: number; // Final payable amount

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount_paid: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  amount_due: number; // Calculated: total_amount - amount_paid

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status:
    | 'pending'
    | 'completed'
    | 'refunded'
    | 'partially_refunded'
    | 'cancelled';

  @Column({ type: 'jsonb', nullable: true })
  payment_info: {
    method: 'cash' | 'card' | 'mobile' | 'credit';
    transaction_id?: string;
    card_last4?: string;
  };

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @ManyToOne(() => User, (staff) => staff.sales, {
    onDelete: 'SET NULL', // Keep sales if staff is deleted
  })
  @Index()
  staff: User;

  @OneToMany(() => LineItem, (item) => item.sale, {
    cascade: true, // Auto-save line items
    eager: true, // Load line items automatically (optional)
  })
  line_items: LineItem[];

  // Virtual property (not stored in DB)
  is_fully_paid: boolean;

  // Lifecycle hooks
  @AfterLoad()
  calculatePaymentStatus() {
    this.is_fully_paid = this.amount_due <= 0;
  }
}
