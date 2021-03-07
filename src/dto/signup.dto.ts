import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsUrl,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDTO {
  @ApiProperty({
    description: `user's fullname`,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: `user's email`,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: `user's password`,
    minLength: 6,
  })
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: `user's avatar`,
  })
  @IsString()
  @IsUrl()
  avatar: string;

  @ApiProperty({
    description: `user's acceptance of terms and conditions`,
  })
  @IsBoolean()
  acceptTerms: boolean;
}
