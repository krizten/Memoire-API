import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsUrl,
  IsBoolean,
} from 'class-validator';

export class SignupDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsUrl()
  avatar: string;

  @IsBoolean()
  acceptTerms: boolean;
}
