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
import { UploadService } from './upload.service';

config();

@ApiUseTags('Uploads')
@ApiBearerAuth()
@Controller(`${process.env.BASE_PATH}/uploads`)
@UseGuards(new AuthGuard())
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('/image')
  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({ name: 'image', required: true, description: 'Add image to entry' })
  imageUpload(@Req() request: any, @Res() response: any) {
    this.uploadService.imageUpload(request, response);
  }

  @Post('/avatar')
  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({ name: 'avatar', required: true, description: 'Upload new avatar' })
  avatarUpload(@Req() request: any, @Res() response: any) {
    this.uploadService.avatarUpload(request, response);
  }
}
