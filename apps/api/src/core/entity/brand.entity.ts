import { Product } from 'src/core/entity/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'brands' })
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  @Index({ fulltext: true })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  @Index()
  slug: string; // For SEO

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logo_url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website_url: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    seo_title?: string;
    seo_description?: string;
    country_of_origin?: string;
  };

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];

  // Virtual property
  get product_count(): number {
    return this.products?.length || 0;
  }
}
