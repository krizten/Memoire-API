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
} from '@nestjs/common';
import { Request } from 'express';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { AuthGuard } from 'src/shared/auth.guard';
import { FileLogger } from 'src/shared/file-logger.service';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { User } from 'src/decorators/user.decorator';
import { LoginDTO } from 'src/dto/login.dto';
import { SignupDTO } from 'src/dto/signup.dto';
import { ChangePasswordDTO } from 'src/dto/change-password.dto';
import { EmailDTO } from 'src/dto/email.dto';
import { ResetPasswordDTO } from 'src/dto/reset-password.dto';

@ApiUseTags('Authentication')
@Controller(`${process.env.BASE_PATH}/auth`)
export class AuthController {
  constructor(private authService: AuthService) {}

  private logger = new Logger('AuthController');

  @Post('/signup')
  @UsePipes(new ValidationPipe())
  signup(@Body() data: SignupDTO) {
    FileLogger.log({
      method: 'POST',
      data,
    });
    this.logger.log(`${JSON.stringify({ method: 'POST', data })}`);
    return this.authService.signup(data);
  }

  @Post('/login')
  @UsePipes(new ValidationPipe())
  login(@Body() data: LoginDTO) {
    FileLogger.log({
      method: 'POST',
      data,
    });
    this.logger.log(`${JSON.stringify({ method: 'POST', data })}`);
    return this.authService.login(data);
  }

  @ApiBearerAuth()
  @Get('/logout')
  @UseGuards(new AuthGuard())
  logout(@Req() request: Request) {
    return this.authService.logout(request);
  }

  @ApiBearerAuth()
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
    return this.authService.changePassword(request, user, data);
  }

  @Post('/forgot-password')
  @UsePipes(new ValidationPipe())
  forgotPassword(@Body() data: EmailDTO) {
    FileLogger.log({
      method: 'POST',
      data,
    });
    this.logger.log(`${JSON.stringify({ method: 'POST', data })}`);
    return this.authService.forgotPassword(data);
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
    return this.authService.resetPassword(token, data);
  }
}
