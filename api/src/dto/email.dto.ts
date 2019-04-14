import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class EmailDTO {

  @ApiModelProperty({
    description: `user's email`,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
