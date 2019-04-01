import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('token')
export class InvalidatedTokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  token: string;
}
