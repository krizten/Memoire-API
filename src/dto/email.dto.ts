import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailDTO {

  @ApiProperty({
    description: `user's email`,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
