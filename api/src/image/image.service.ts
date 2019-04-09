import { config } from 'dotenv';
import {
  Injectable,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';

config();

let targetFolder: string;

@Injectable()
export class ImageService {
  private s3 = new AWS.S3();

  private upload = multer({
    storage: multerS3({
      s3: this.s3,
      bucket: process.env.AWS_S3_BUCKET_NAME,
      acl: 'public-read',
      metadata(request, file, callback) {
        callback(null, { fieldName: file.fieldname });
      },
      key(request, file, callback) {
        callback(null, `${targetFolder}/${Date.now().toString()}_${file.originalname}`);
      },
    }),
  });

  private init(folder: string = 'image') {
    AWS.config.update({
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      region: process.env.AWS_REGION_CODE,
    });
    targetFolder = folder;
  }

  async baseUpload(request: any, response: any, uploadType: string): Promise<any> {
    this.init(uploadType);
    const upload = this.upload.single(uploadType);
    try {
      await upload(request, response, err => {
        if (err) {
          throw new HttpException(
            `Image upload failed: ${err.message}`,
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }

        return response.status(HttpStatus.OK).json({
          summary: 'Image upload was successful',
          success: true,
          status: HttpStatus.OK,
          data: {
            imageURL: request.file.location,
          },
        });
      });
    } catch (error) {
      throw new HttpException(
        `Upload failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async imageUpload(request: any, response: any): Promise<any> {
    await this.baseUpload(request, response, 'image');
  }
}
