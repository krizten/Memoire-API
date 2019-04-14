import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('reset_token')
export class ResetTokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  token: string;
}
