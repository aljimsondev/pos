import { Product } from 'src/core/entity/product.entity';
import { Variation } from 'src/core/entity/variation.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PhotoType {
  MAIN = 'main',
  GALLERY = 'gallery',
  THUMBNAIL = 'thumbnail',
  SWATCH = 'swatch',
  DOCUMENT = 'document',
}

@Entity({ name: 'photos' })
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  @Index()
  url: string; // Full URL to the image

  @Column({ type: 'varchar', length: 255, nullable: true })
  thumbnail_url: string; // URL to thumbnail version

  @Column({ type: 'varchar', length: 255 })
  file_name: string; // Original filename

  @Column({ type: 'varchar', length: 50 })
  file_type: string; // e.g., 'image/jpeg', 'image/png'

  @Column({ type: 'int', nullable: true })
  file_size: number; // In bytes

  @Column({ type: 'int', nullable: true })
  width: number; // Image width in pixels

  @Column({ type: 'int', nullable: true })
  height: number; // Image height in pixels

  @Column({
    type: 'enum',
    enum: PhotoType,
    default: PhotoType.GALLERY,
  })
  @Index()
  type: PhotoType; // Usage type of the photo

  @Column({ type: 'int', default: 0 })
  display_order: number; // For sorting photos

  @Column({ type: 'text', nullable: true })
  alt_text: string; // For accessibility and SEO

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    dominant_color?: string;
    focal_point?: { x: number; y: number };
    storage_provider?: string;
    is_ai_generated?: boolean;
  };

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Product, (product) => product.photos, {
    onDelete: 'CASCADE', // Delete photos when product is deleted
  })
  @Index()
  product: Product;

  @ManyToOne(() => Variation, (variation) => variation.photos, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @Index()
  variation: Variation | null; // Optional link to specific variation

  // Virtual property
  get aspect_ratio(): number | null {
    return this.width && this.height ? this.width / this.height : null;
  }
}
