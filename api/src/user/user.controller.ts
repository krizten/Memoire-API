import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from 'src/dto/user';
import { ValidationPipe } from 'src/shared/validation.pipe';

@Controller(`${process.env.BASE_PATH}/auth`)
export class UserController {

  constructor(private userService: UserService) {}

  @Post('/signup')
  @UsePipes(new ValidationPipe())
  signup(@Body() data: UserDTO) {
    return this.userService.signup(data);
  }
}
