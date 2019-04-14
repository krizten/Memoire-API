import { MinLength, IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class PasswordDTO {
  @ApiModelProperty({
    description: 'password of the user',
  })
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
