import { IsString, ValidateIf, IsUrl, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { GeoCoordinatesDTO } from './geo-coordinates.dto';

export class EntryDTO {
  @ApiProperty({
    description: 'title of entry',
  })
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: 'content of entry',
  })
  @IsString()
  readonly content: string;

  @ApiProperty({
    required: false,
    description: 'optional descriptive image to go with entry',
  })
  @ValidateIf(obj => (obj.image) ? true : false)
  @IsString()
  @IsUrl()
  readonly image?: string;

  @ApiProperty({
    required: false,
    description: 'optional geolocation to capture where location associated with entry',
  })
  @ValidateIf(obj => (obj.geolocation) ? true : false)
  @ValidateNested()
  readonly geolocation?: GeoCoordinatesDTO;
}
