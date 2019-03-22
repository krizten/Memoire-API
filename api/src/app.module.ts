import { Module } from '@nestjs/common';
import {TypeOrmModule } from '@nestjs/typeorm';

import configuration from './config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EntryModule } from './entry/entry.module';

@Module({
  imports: [TypeOrmModule.forRoot(configuration.db), EntryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
