import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { ICoordinates } from 'src/interfaces/coordinates.interface';
import { UserEntity } from 'src/user/user.entity';
import { GeoCoordinatesDTO } from 'src/dto/geo-coordinates.dto';

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
  geolocation: GeoCoordinatesDTO;

  @ManyToOne(type => UserEntity, author => author.entries)
  author: UserEntity;
}
