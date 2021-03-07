import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from 'src/database/database.module';
import { userProviders } from './user.providers';
import { logoutTokenProviders } from './logout-token.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [...userProviders, ...logoutTokenProviders, AuthService],
})
export class AuthModule { }
