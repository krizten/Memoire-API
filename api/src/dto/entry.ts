import { IsString } from 'class-validator';
import { ICoordinates } from 'src/types/coordinates';

export class EntryDTO {
  @IsString()
  readonly title: string;

  @IsString()
  readonly content: string;

  @IsString()
  readonly image?: string;

  readonly location?: ICoordinates;
}
