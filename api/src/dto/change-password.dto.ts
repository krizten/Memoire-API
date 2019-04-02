import { MinLength, IsNotEmpty } from 'class-validator';

export class ChangePasswordDTO {
  @MinLength(6)
  @IsNotEmpty()
  currentPassword: string;

  @MinLength(6)
  @IsNotEmpty()
  newPassword: string;

  @MinLength(6)
  @IsNotEmpty()
  confirmPassword: string;
}
