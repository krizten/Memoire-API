import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  ValidateIf,
  IsDateString,
  IsUrl,
  IsBoolean,
} from 'class-validator';

export class UserDTO {
  @IsEmail()
  email: string;

  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsUrl()
  avatar: string;

  @IsBoolean()
  acceptTerms: boolean;

  @ValidateIf(obj => (obj.dateOfBirth ? true : false))
  @IsDateString()
  dateOfBirth: Date;

  @ValidateIf(obj => (obj.gender ? true : false))
  @IsString()
  gender: string;

  @ValidateIf(obj => (obj.bio ? true : false))
  @IsString()
  bio: string;
}
