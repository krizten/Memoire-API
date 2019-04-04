import { MinLength, IsNotEmpty } from 'class-validator';

export class ResetPasswordDTO {
  @MinLength(6)
  @IsNotEmpty()
  newPassword: string;

  @MinLength(6)
  @IsNotEmpty()
  confirmPassword: string;
}
