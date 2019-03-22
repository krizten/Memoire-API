import { Module } from '@nestjs/common';
import {TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import configuration from './config';

@Module({
  imports: [TypeOrmModule.forRoot(configuration.db)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
