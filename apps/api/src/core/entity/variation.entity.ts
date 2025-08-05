import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('variations')
export class Variation {
  @PrimaryGeneratedColumn()
  id: number;
}
