import * as bcrypt from 'bcrypt';
import { Sale } from 'src/core/entity/sale.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type UserRole =
  | 'admin'
  | 'manager'
  | 'cashier'
  | 'inventory'
  | 'reporting';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ['admin', 'manager', 'cashier', 'inventory', 'reporting'],
    default: 'cashier',
  })
  @Index()
  role: UserRole;

  @Column({ length: 50 })
  @Index()
  first_name: string;

  @Column({ length: 50 })
  @Index()
  last_name: string;

  @Column({ length: 100, unique: true })
  @Index()
  email: string;

  @Column({ length: 20, unique: true, nullable: true })
  phone: string;

  @Column({ length: 100, select: false }) // Never returned in queries by default
  password: string;

  @Column({ type: 'varchar', length: 10, unique: true })
  employee_id: string; // POS system employee ID

  @Column({ type: 'boolean', default: true })
  is_active: boolean; // For soft-delete

  @Column({ type: 'boolean', default: false })
  must_change_password: boolean;

  @Column({ type: 'timestamp', nullable: true })
  password_changed_at: Date;

  @Column({ type: 'jsonb', nullable: true })
  permissions: {
    discount?: {
      max_percentage: number;
      max_amount: number;
    };
    refund?: boolean;
    inventory_edit?: boolean;
  };

  @OneToMany(() => Sale, (sale) => sale.staff)
  sales: Sale[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  last_sign_in: Date;

  @Column({ type: 'timestamp', nullable: true })
  last_activity: Date;

  @Column({ type: 'varchar', length: 45, nullable: true })
  last_ip: string;

  // Virtual property
  get full_name(): string {
    return `${this.first_name} ${this.last_name}`;
  }

  // Lifecycle hooks
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
      this.password_changed_at = new Date();
    }
  }

  // Method to verify password
  comparePassword(attempt: string): Promise<boolean> {
    return bcrypt.compare(attempt, this.password);
  }
}
