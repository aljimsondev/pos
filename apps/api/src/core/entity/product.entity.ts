import { Brand } from 'src/core/entity/brand.entity';
import { Category } from 'src/core/entity/category.entity';
import { Photo } from 'src/core/entity/photo.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Photo, (photo) => photo.product)
  photos: Photo[];

  // product can only have one brand
  @ManyToOne(() => Brand, (brand) => brand.product)
  brand: Brand;

  @ManyToOne(() => Category, (category) => category.product)
  category: Category;

  @Column()
  description: string;

  @Column()
  barcode: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @Column('jsonb', { default: {} })
  metadata: Record<string, any>;
}
