import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';
import { EntryService } from './entry.service';
import { EntryController } from './entry.controller';
import { entryProviders } from './entry.providers';
import { userProviders } from 'src/auth/user.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [EntryController],
  providers: [...entryProviders, ...userProviders, EntryService],
})
export class EntryModule { }
