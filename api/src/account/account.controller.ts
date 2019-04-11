import { Controller, UseGuards, Logger, Get, ValidationPipe, Put, UsePipes, Body, Delete, Req } from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

import { FileLogger } from 'src/shared/file-logger.service';
import { AccountService } from './account.service';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from 'src/decorators/user.decorator';
import { AccountDTO } from 'src/dto/account.dto';
import { PasswordDTO } from 'src/dto/password.dto';

@ApiUseTags('Account')
@ApiBearerAuth()
@Controller(`${process.env.BASE_PATH}/account`)
@UseGuards(new AuthGuard())
export class AccountController {
  constructor(private accountService: AccountService) {}

  private logger = new Logger('AccountController');

  @Get()
  getAccount(@User('id') user: string) {
    return this.accountService.getAccount(user);
  }

  @Put()
  @UsePipes(new ValidationPipe())
  updateAccount(@User('id') user: string, @Body() data: Partial<AccountDTO>) {
    FileLogger.log({
      method: 'PUT',
      user,
      data,
    });
    this.logger.log(`${JSON.stringify({ method: 'POST', user, data })}`);
    return this.accountService.updateAccount(user, data);
  }

  @Delete()
  @UsePipes(new ValidationPipe())
  deleteAccount(@Req() request: Request, @User('id') user: string, @Body() data: PasswordDTO) {
    FileLogger.log({
      method: 'PUT',
      user,
    });
    this.logger.log(`${JSON.stringify({ method: 'POST', user })}`);
    return this.accountService.deleteAccount(request, user, data);
  }
}
