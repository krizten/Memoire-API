import { IsString, ValidateIf, IsUrl, ValidateNested } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

import { GeoCoordinatesDTO } from './geo-coordinates.dto';

export class EntryDTO {
  @ApiModelProperty({
    description: 'title of entry',
  })
  @IsString()
  readonly title: string;

  @ApiModelProperty({
    description: 'content of entry',
  })
  @IsString()
  readonly content: string;

  @ApiModelProperty({
    required: false,
    description: 'optional descriptive image to go with entry',
  })
  @ValidateIf(obj => (obj.image) ? true : false)
  @IsString()
  @IsUrl()
  readonly image?: string;

  @ApiModelProperty({
    required: false,
    description: 'optional geolocation to capture where location associated with entry',
  })
  @ValidateIf(obj => (obj.geolocation) ? true : false)
  @ValidateNested()
  readonly geolocation?: GeoCoordinatesDTO;
}
