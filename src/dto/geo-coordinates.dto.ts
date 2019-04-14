import { IsNumber } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class GeoCoordinatesDTO {
  @ApiModelProperty({
    description: 'latitude of geolocation',
  })
  @IsNumber()
  readonly lat: number;

  @ApiModelProperty({
      description: 'latitude of geolocation',
    })
  @IsNumber()
  readonly lng: number;
}
