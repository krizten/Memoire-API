import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { ICoordinates } from 'src/types/coordinates';

@Entity('entries')
export class EntryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column('text')
  title: string;

  @Column('text')
  content: string;

  @Column('text', { nullable: true })
  image: string;

  @Column('json', { nullable: true })
  geolocation: ICoordinates;
}
