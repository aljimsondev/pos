import { User } from 'src/core/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  total_amount: number;

  @Column()
  vat: number;

  @Column()
  payable_amount: number;

  @Column({ nullable: true })
  discount: number;

  @Column()
  amount_paid: number;

  @ManyToOne(() => User, (staff) => staff)
  staff: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
