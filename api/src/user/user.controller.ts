import {
  Controller,
  Post,
  Body,
  UsePipes,
  Logger,
  Get,
  UseGuards,
  Req,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { Request } from 'express';

import { UserService } from './user.service';
import { AuthGuard } from 'src/shared/auth.guard';
import { FileLogger } from 'src/shared/file-logger.service';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { User } from 'src/decorators/user.decorator';
import { LoginDTO } from 'src/dto/login.dto';
import { SignupDTO } from 'src/dto/signup.dto';
import { ChangePasswordDTO } from 'src/dto/change-password.dto';
import { ForgotPasswordDTO } from 'src/dto/forgot-password.dto';
import { ResetPasswordDTO } from 'src/dto/reset-password.dto';
import { AccountDTO } from 'src/dto/account.dto';
import { DeleteAccountDTO } from 'src/dto/delete-account.dto';

@Controller(`${process.env.BASE_PATH}/auth`)
export class UserController {
  constructor(private userService: UserService) {}

  private logger = new Logger('UserController');

  @Post('/signup')
  @UsePipes(new ValidationPipe())
  signup(@Body() data: SignupDTO) {
    FileLogger.log({
      method: 'POST',
      data,
    });
    this.logger.log(`${JSON.stringify({ method: 'POST', data })}`);
    return this.userService.signup(data);
  }

  @Post('/login')
  @UsePipes(new ValidationPipe())
  login(@Body() data: LoginDTO) {
    FileLogger.log({
      method: 'POST',
      data,
    });
    this.logger.log(`${JSON.stringify({ method: 'POST', data })}`);
    return this.userService.login(data);
  }

  @Get('/logout')
  @UseGuards(new AuthGuard())
  logout(@Req() request: Request) {
    return this.userService.logout(request);
  }

  @Post('/change-password')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  changePassword(
    @Req() request: Request,
    @User('id') user: string,
    @Body() data: ChangePasswordDTO,
  ) {
    FileLogger.log({
      method: 'POST',
      user,
      data,
    });
    this.logger.log(`${JSON.stringify({ method: 'POST', user, data })}`);
    return this.userService.changePassword(request, user, data);
  }

  @Post('/forgot-password')
  @UsePipes(new ValidationPipe())
  forgotPassword(@Body() data: ForgotPasswordDTO) {
    FileLogger.log({
      method: 'POST',
      data,
    });
    this.logger.log(`${JSON.stringify({ method: 'POST', data })}`);
    return this.userService.forgotPassword(data);
  }

  @Post('/reset-password')
  @UsePipes(new ValidationPipe())
  resetPassword(@Query('key') token: string, @Body() data: ResetPasswordDTO) {
    FileLogger.log({
      method: 'POST',
      token,
      data,
    });
    this.logger.log(`${JSON.stringify({ method: 'POST', token, data })}`);
    return this.userService.resetPassword(token, data);
  }

  @Get('/account')
  @UseGuards(new AuthGuard())
  getAccount(@User('id') user: string) {
    return this.userService.getAccount(user);
  }

  @Put('/account')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  updateAccount(@User('id') user: string, @Body() data: Partial<AccountDTO>) {
    FileLogger.log({
      method: 'PUT',
      user,
      data,
    });
    this.logger.log(`${JSON.stringify({ method: 'POST', user, data })}`);
    return this.userService.updateAccount(user, data);
  }

  @Delete('/account')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  deleteAccount(
    @Req() request: Request,
    @User('id') user: string,
    @Body() data: DeleteAccountDTO,
  ) {
    FileLogger.log({
      method: 'PUT',
      user,
    });
    this.logger.log(`${JSON.stringify({ method: 'POST', user })}`);
    return this.userService.deleteAccount(request, user, data);
  }
}
