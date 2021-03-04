import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EntryEntity } from '../entry/entry.entity';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([EntryEntity])],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
