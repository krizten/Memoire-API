import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { LogoutTokenEntity } from './logout-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, LogoutTokenEntity])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
