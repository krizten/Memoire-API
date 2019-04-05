import { MinLength, IsNotEmpty } from 'class-validator';

export class PasswordDTO {
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
