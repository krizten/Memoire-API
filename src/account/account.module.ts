import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { UserEntity } from '../auth/user.entity';
import { EntryEntity } from '../entry/entry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, EntryEntity])],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
