import { MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PasswordDTO {
  @ApiProperty({
    description: 'password of the user',
  })
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
