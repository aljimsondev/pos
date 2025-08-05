import { User } from 'src/core/entity/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP', // For MySQL/MariaDB
  })
  updated_at: Date;
}
