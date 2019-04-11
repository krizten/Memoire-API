import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EntryService } from './entry.service';
import { EntryController } from './entry.controller';
import { EntryEntity } from './entry.entity';
import { UserEntity } from 'src/auth/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EntryEntity, UserEntity])],
  controllers: [EntryController],
  providers: [EntryService],
})
export class EntryModule {}
