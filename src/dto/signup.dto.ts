import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsUrl,
  IsBoolean,
} from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class SignupDTO {
  @ApiModelProperty({
    description: `user's fullname`,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiModelProperty({
    description: `user's email`,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiModelProperty({
    description: `user's password`,
    minLength: 6,
  })
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiModelProperty({
    description: `user's avatar`,
  })
  @IsString()
  @IsUrl()
  avatar: string;

  @ApiModelProperty({
    description: `user's acceptance of terms and conditions`,
  })
  @IsBoolean()
  acceptTerms: boolean;
}
