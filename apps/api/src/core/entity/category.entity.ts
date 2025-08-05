import { Product } from 'src/core/entity/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  category_name: string;

  @OneToMany(() => Product, (product) => product)
  product: Product;
}
