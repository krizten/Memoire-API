import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiModelProperty({
    description: `user's email`,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiModelProperty({
    description: `user's password`,
  })
  @IsNotEmpty()
  password: string;
}
