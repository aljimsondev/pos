import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'categories' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category_name: string;
}
