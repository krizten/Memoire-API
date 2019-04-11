import { config } from 'dotenv';
import {
  Controller,
  UseGuards,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth, ApiConsumes, ApiImplicitFile } from '@nestjs/swagger';

import { AuthGuard } from 'src/shared/auth.guard';
import { ImageService } from './image.service';

config();

@ApiUseTags('Uploads')
@ApiBearerAuth()
@Controller(`${process.env.BASE_PATH}/uploads`)
@UseGuards(new AuthGuard())
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Post('/image')
  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({ name: 'image', required: true, description: 'Add image to entry' })
  imageUpload(@Req() request: any, @Res() response: any) {
    this.imageService.imageUpload(request, response);
  }

  @Post('/avatar')
  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({ name: 'avatar', required: true, description: 'Upload new avatar' })
  avatarUpload(@Req() request: any, @Res() response: any) {
    this.imageService.avatarUpload(request, response);
  }
}
