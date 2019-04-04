import { MinLength, IsNotEmpty } from 'class-validator';

export class DeleteAccountDTO {
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
