import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('line_items')
export class LineItems {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  unit_price: number;

  @Column()
  quantity: number;

  @Column()
  variation: any;
}
