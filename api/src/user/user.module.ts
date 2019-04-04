import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { LogoutTokenEntity } from './logout-token.entity';
import { EntryEntity } from 'src/entry/entry.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, LogoutTokenEntity, EntryEntity]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
