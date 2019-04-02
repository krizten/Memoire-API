import { Controller, Post, Body, UsePipes, Logger, Get, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';

import { FileLogger } from 'src/shared/file-logger.service';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { UserService } from './user.service';
import { LoginDTO } from 'src/dto/login.dto';
import { SignupDTO } from 'src/dto/signup.dto';
import { AuthGuard } from 'src/shared/auth.guard';
import { ChangePasswordDTO } from 'src/dto/change-password.dto';
import { User } from 'src/decorators/user.decorator';

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
  changePassword(@Req() request: Request, @User('id') user: string, @Body() data: ChangePasswordDTO) {
    FileLogger.log({
      method: 'POST',
      user,
      data,
    });
    this.logger.log(`${JSON.stringify({ method: 'POST', user, data })}`);
    return this.userService.changePassword(request, user, data);
  }

  @Post('/forgot-password')
  forgotPassword() {
    //
  }
}
