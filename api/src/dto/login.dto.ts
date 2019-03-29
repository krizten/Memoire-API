import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDTO {

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
