import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GeoCoordinatesDTO {
  @ApiProperty({
    description: 'latitude of geolocation',
  })
  @IsNumber()
  readonly lat: number;

  @ApiProperty({
      description: 'latitude of geolocation',
    })
  @IsNumber()
  readonly lng: number;
}
