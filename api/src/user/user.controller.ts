import { Controller, Post, Body, UsePipes, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from 'src/dto/user';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { FileLogger } from 'src/shared/file-logger.service';
import { LoginDTO } from 'src/dto/login';

@Controller(`${process.env.BASE_PATH}/auth`)
export class UserController {

  constructor(private userService: UserService) {}

  private logger = new Logger('UserController');

  @Post('/signup')
  @UsePipes(new ValidationPipe())
  signup(@Body() data: UserDTO) {
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
}
