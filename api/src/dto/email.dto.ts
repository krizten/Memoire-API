import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailDTO {

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
