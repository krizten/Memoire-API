import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EntryEntity } from './entry.entity';
import { EntryService } from './entry.service';
import { EntryController } from './entry.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EntryEntity])],
  controllers: [EntryController],
  providers: [EntryService],
})
export class EntryModule {}
