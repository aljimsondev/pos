import { Brand } from 'src/core/entity/brand.entity';
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
}
