import { config } from 'dotenv';
import {
  Controller,
  UseGuards,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth.guard';
import { ImageService } from './image.service';

config();

@Controller(`${process.env.BASE_PATH}/uploads`)
@UseGuards(new AuthGuard())
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Post('/image')
  imageUpload(@Req() request: any, @Res() response: any) {
    this.imageService.imageUpload(request, response);
  }
}
