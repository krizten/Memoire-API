import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('logout_token')
export class LogoutTokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  token: string;
}
