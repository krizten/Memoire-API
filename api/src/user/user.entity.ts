import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { EntryEntity } from 'src/entry/entry.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @Column({
    type: 'text',
    unique: true,
  })
  email: string;

  @Column('text')
  password: string;

  @Column('text')
  avatar: string;

  @Column('boolean')
  acceptTerms: boolean;

  @Column('date', { nullable: true })
  dateOfBirth: Date;

  @Column('text', { nullable: true })
  gender: string;

  @Column('text', { nullable: true })
  bio: string;

  @OneToMany(type => EntryEntity, entry => entry.author)
  entries: EntryEntity[];

  @BeforeInsert()
  async hashPassword() {
    const salt = 10;
    this.password = await bcrypt.hash(this.password, salt);
  }
}
