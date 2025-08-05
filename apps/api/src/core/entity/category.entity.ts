import { Product } from 'src/core/entity/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'categories' })
@Tree('nested-set') // or 'materialized-path'/'closure-table'
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  @Index({ fulltext: true })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  @Index()
  slug: string; // For SEO-friendly URLs

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image_url: string;

  @Column({ type: 'int', default: 0 })
  display_order: number; // For sorting categories

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    seo_title?: string;
    seo_description?: string;
    filters?: string[]; // e.g., ['color', 'size']
  };

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Self-referential hierarchy
  @TreeChildren()
  children: Category[];

  @TreeParent()
  parent: Category | null;

  // Products relationship (changed to ManyToMany for flexibility)
  @ManyToMany(() => Product, (product) => product.category)
  @JoinTable({
    name: 'product_categories',
    joinColumn: { name: 'category_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' },
  })
  products: Product[];

  // Virtual property
  get product_count(): number {
    return this.products?.length || 0;
  }
}
