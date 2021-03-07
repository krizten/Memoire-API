import { Module } from '@nestjs/common';

import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { DatabaseModule } from 'src/database/database.module';
import { entryProviders } from 'src/entry/entry.providers';
import { userProviders } from 'src/auth/user.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [AccountController],
  providers: [...entryProviders, ...userProviders, AccountService],
})
export class AccountModule {}
