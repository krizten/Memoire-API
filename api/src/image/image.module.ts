import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EntryEntity } from 'src/entry/entry.entity';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';

@Module({
  imports: [TypeOrmModule.forFeature([EntryEntity])],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
