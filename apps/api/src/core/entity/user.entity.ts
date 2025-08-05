import { Sale } from 'src/core/entity/sale.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  role: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  password: string;

  @OneToMany(() => Sale, (sale) => sale.staff)
  sales: Sale[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  last_sign_in: Date;
}
