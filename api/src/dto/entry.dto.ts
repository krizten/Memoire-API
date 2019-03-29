import { IsString, ValidateIf, IsUrl } from 'class-validator';
import { ICoordinates } from 'src/interfaces/coordinates.interface';

export class EntryDTO {
  @IsString()
  readonly title: string;

  @IsString()
  readonly content: string;

  @ValidateIf(obj => (obj.image) ? true : false)
  @IsString()
  @IsUrl()
  readonly image?: string;

  readonly geolocation?: ICoordinates;
}
