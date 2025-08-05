import { Sale } from 'src/core/entity/sale.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @Column()
  last_sign_in: Date;
}
