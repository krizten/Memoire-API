import { IsString, IsNotEmpty, IsUrl, IsDateString } from 'class-validator';

export class AccountDTO {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsUrl()
  avatar: string;

  @IsDateString()
  dateOfBirth: Date;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  bio: string;
}
