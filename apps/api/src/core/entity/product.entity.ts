import { Brand } from 'src/core/entity/brand.entity';
import { Category } from 'src/core/entity/category.entity';
import { Photo } from 'src/core/entity/photo.entity';
import { Variation } from 'src/core/entity/variation.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  @Index({ fulltext: true }) // For full-text search
  name: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  short_description: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  @Index()
  sku: string; // Main product SKU

  @Column({ type: 'varchar', length: 50, nullable: true })
  @Index()
  barcode: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  slug: string; // For SEO-friendly URLs

  @Column({ type: 'boolean', default: true })
  is_active: boolean; // Soft delete

  @Column({ type: 'boolean', default: false })
  is_featured: boolean;

  @Column({ type: 'jsonb', default: {} })
  metadata: {
    specifications?: Record<string, any>;
    features?: string[];
    dimensions?: {
      length?: number;
      width?: number;
      height?: number;
      unit?: 'cm' | 'in';
    };
    warranty?: string;
  };

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @VersionColumn()
  version: number; // For optimistic locking

  // Relations
  @OneToMany(() => Photo, (photo) => photo.product, {
    cascade: true, // Auto-save photos when product is saved
    eager: true, // Load photos automatically (for some use cases)
  })
  photos: Photo[];

  @ManyToOne(() => Brand, (brand) => brand.products, {
    onDelete: 'SET NULL', // Don't delete product if brand is deleted
  })
  @Index()
  brand: Brand;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL',
  })
  @Index()
  category: Category;

  @OneToMany(() => Variation, (variation) => variation.product, {
    cascade: true, // Auto-save variations
  })
  variations: Variation[];

  // Virtual property (not stored in DB)
  get has_stock(): boolean {
    return this.variations?.some((v) => v.quantity > 0) ?? false;
  }
}
