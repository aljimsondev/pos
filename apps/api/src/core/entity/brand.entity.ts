import { Product } from 'src/core/entity/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'brands' })
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  brand_name: string;

  // brand can many product
  @OneToMany(() => Product, (product) => product)
  product: Product;
}
