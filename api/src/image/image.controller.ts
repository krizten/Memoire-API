import { config } from 'dotenv';
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth.guard';
import { ImageService } from './image.service';

config();

@Controller(`${process.env.BASE_PATH}/images`)
@UseGuards(new AuthGuard())
export class ImageController {
  constructor(private imageService: ImageService) {}
}
