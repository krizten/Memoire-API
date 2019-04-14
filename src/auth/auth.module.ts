import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LogoutTokenEntity } from './logout-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, LogoutTokenEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
