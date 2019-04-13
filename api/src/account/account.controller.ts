import {
  Controller,
  UseGuards,
  Logger,
  Get,
  ValidationPipe,
  Put,
  UsePipes,
  Body,
  Delete,
  Req,
} from '@nestjs/common';
import {
  ApiUseTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiBadRequestResponse,
  ApiImplicitBody,
} from '@nestjs/swagger';
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
  /***** Swagger API Doc Start *****/
  @ApiOperation({ title: 'Get User Account Details', description: 'Retrieve current account details of the user' })
  @ApiOkResponse({ description: 'Account deta retrieved successfully' })
  @ApiForbiddenResponse({ description: 'Authorization has been denied for this request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  /***** Swagger API Doc End *****/
  getAccount(@User('id') user: string) {
    return this.accountService.getAccount(user);
  }

  @Put()
  /***** Swagger API Doc Start *****/
  @ApiImplicitBody({ name: 'AccountDTO', type: AccountDTO })
  @ApiOperation({ title: 'Update User Account', description: 'Update user existing account information' })
  @ApiOkResponse({ description: 'User account updated successfully' })
  @ApiBadRequestResponse({ description: 'Error in request headers or body' })
  @ApiForbiddenResponse({ description: 'Authorization has been denied for this request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  /***** Swagger API Doc End *****/
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
  /***** Swagger API Doc Start *****/
  @ApiOperation({ title: 'Delete User Account', description: 'Delete user account and entries created by the user' })
  @ApiOkResponse({ description: 'User account deleted successfully' })
  @ApiBadRequestResponse({ description: 'Error in request headers or body' })
  @ApiForbiddenResponse({ description: 'Authorization has been denied for this request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  /***** Swagger API Doc End *****/
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
