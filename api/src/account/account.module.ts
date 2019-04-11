import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { UserEntity } from 'src/auth/user.entity';
import { EntryEntity } from 'src/entry/entry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, EntryEntity])],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
