import { IsString, IsNotEmpty, IsUrl, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AccountDTO {

  @ApiProperty({
    description: `user's fullname`,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: `user's avatar URL`,
  })
  @IsString()
  @IsUrl()
  avatar: string;

  @ApiProperty({
    description: `user's date of birth`,
    type: String,
  })
  @IsDateString()
  dateOfBirth: Date;

  @ApiProperty({
    description: `user's gender`,
  })
  @IsNotEmpty()
  @IsString()
  gender: string;

  @ApiProperty({
    description: `user's biography (About me)`,
  })
  @IsNotEmpty()
  @IsString()
  bio: string;
}
