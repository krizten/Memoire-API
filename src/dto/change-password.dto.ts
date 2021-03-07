import { MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDTO {
  @ApiProperty({
    description: `user's current password`,
  })
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({
    description: `user's new password`,
    minLength: 6,
  })
  @MinLength(6)
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty({
    description: `confirm new password`,
    minLength: 6,
  })
  @MinLength(6)
  @IsNotEmpty()
  confirmPassword: string;
}
