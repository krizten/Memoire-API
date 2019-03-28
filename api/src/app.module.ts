import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EntryModule } from './entry/entry.module';
import { HttpExceptionFilter } from './shared/http-exception.filter';
import { LoggingInterceptor } from './shared/logging.interceptor';
import { UserModule } from './user/user.module';

import configuration from './config';

@Module({
  imports: [TypeOrmModule.forRoot(configuration.db), EntryModule, UserModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
