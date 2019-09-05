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
import {
  ApiUseTags,
  ApiBearerAuth,
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { AuthGuard } from '../shared/auth.guard';
import { FileLogger } from '../shared/file-logger.service';
import { ValidationPipe } from '../shared/validation.pipe';
import { User } from '../decorators/user.decorator';
import { LoginDTO } from '../dto/login.dto';
import { SignupDTO } from '../dto/signup.dto';
import { ChangePasswordDTO } from '../dto/change-password.dto';
import { EmailDTO } from '../dto/email.dto';
import { ResetPasswordDTO } from '../dto/reset-password.dto';

@ApiUseTags('Authentication')
@Controller(`${process.env.BASE_PATH}/auth`)
export class AuthController {
  constructor(private authService: AuthService) {}

  private logger = new Logger('AuthController');

  @Post('/signup')
  /***** Swagger API Doc Start *****/
  @ApiOperation({
    title: 'Signup New User',
    description: 'Create a new user account',
  })
  @ApiCreatedResponse({ description: 'User signed up successfully' })
  @ApiBadRequestResponse({ description: 'Error in request headers or body' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  /***** Swagger API Doc End *****/
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
  /***** Swagger API Doc Start *****/
  @ApiOperation({
    title: 'Login Registered User',
    description: 'Login an existing user with valid credentials',
  })
  @ApiCreatedResponse({ description: 'User logged in successfully' })
  @ApiBadRequestResponse({ description: 'Error in request headers or body' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  /***** Swagger API Doc End *****/
  @UsePipes(new ValidationPipe())
  login(@Body() data: LoginDTO) {
    FileLogger.log({
      method: 'POST',
      data,
    });
    this.logger.log(`${JSON.stringify({ method: 'POST', data })}`);
    return this.authService.login(data);
  }

  @Get('/logout')
  /***** Swagger API Doc Start *****/
  @ApiBearerAuth()
  @ApiOperation({
    title: 'Logout User',
    description: 'Log out a previously signed-in user',
  })
  @ApiOkResponse({ description: 'User logged out successfully' })
  @ApiForbiddenResponse({
    description: 'Authorization has been denied for this request',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  /***** Swagger API Doc End *****/
  @UseGuards(new AuthGuard())
  logout(@Req() request: Request) {
    return this.authService.logout(request);
  }

  @Post('/change-password')
  /***** Swagger API Doc Start *****/
  @ApiBearerAuth()
  @ApiOperation({
    title: 'Change Current Password',
    description: `Change user's current password`,
  })
  @ApiCreatedResponse({ description: 'Password changed successfully' })
  @ApiBadRequestResponse({ description: 'Error in request headers or body' })
  @ApiForbiddenResponse({
    description: 'Authorization has been denied for this request',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  /***** Swagger API Doc End *****/
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
  /***** Swagger API Doc Start *****/
  @ApiOperation({
    title: 'User Forgot Password',
    description: `Send password reset link to user's email`,
  })
  @ApiCreatedResponse({ description: 'Password reset email sent to user' })
  @ApiBadRequestResponse({ description: 'Error in request headers or body' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  /***** Swagger API Doc End *****/
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
  /***** Swagger API Doc Start *****/
  @ApiBearerAuth()
  @ApiOperation({
    title: 'Reset User Password',
    description: `Reset user's password to overwrite forgotten password`,
  })
  @ApiCreatedResponse({ description: 'Password reset was successful' })
  @ApiBadRequestResponse({ description: 'Error in request headers or body' })
  @ApiForbiddenResponse({
    description: 'Authorization has been denied for this request',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  /***** Swagger API Doc End *****/
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

  @Get('/self')
  /***** Swagger API Doc Start *****/
  @ApiBearerAuth()
  @ApiOperation({
    title: 'Current User Information',
    description: `Retrieve the information of the current user`,
  })
  @ApiOkResponse({ description: `User's information retrieved successfully` })
  @ApiBadRequestResponse({ description: 'Error in request headers or body' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  /***** Swagger API Doc End *****/
  @UseGuards(new AuthGuard())
  getSelf(@User('id') user: string) {
    FileLogger.log({
      method: 'GET',
    });
    this.logger.log(`${JSON.stringify({ method: 'GET'})}`);
    return this.authService.self(user);
  }
}
