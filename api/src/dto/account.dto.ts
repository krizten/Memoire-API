import { IsString, IsNotEmpty, IsUrl, IsDateString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class AccountDTO {

  @ApiModelProperty({
    description: `user's fullname`,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiModelProperty({
    description: `user's avatar URL`,
  })
  @IsString()
  @IsUrl()
  avatar: string;

  @ApiModelProperty({
    description: `user's date of birth`,
    type: String,
  })
  @IsDateString()
  dateOfBirth: Date;

  @ApiModelProperty({
    description: `user's gender`,
  })
  @IsNotEmpty()
  @IsString()
  gender: string;

  @ApiModelProperty({
    description: `user's biography (About me)`,
  })
  @IsNotEmpty()
  @IsString()
  bio: string;
}
