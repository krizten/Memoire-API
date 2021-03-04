import { config } from 'dotenv';
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import { IResponse } from '../interfaces/response.interface';

config();

let targetFolder: string;

const fileFilter = (req: any, file: any, cb: any) => {
  const supportedMimetypes = ['image/png', 'image/jpeg'];
  (!supportedMimetypes.includes(file.mimetype)) ? cb(new Error('MIME type not supported.'), false) : cb(null, true);
};

@Injectable()
export class UploadService {
  private s3 = new AWS.S3();

  private upload = multer({
    fileFilter,
    limits: {
      fileSize: 200000, // max-size: 200KB
    },
    storage: multerS3({
      s3: this.s3,
      bucket: process.env.AWS_S3_BUCKET_NAME,
      acl: 'public-read',
      metadata(request, file, callback) {
        callback(null, { fieldName: file.fieldname });
      },
      key(request, file, callback) {
        callback(
          null,
          `${targetFolder}/${Date.now().toString()}_${file.originalname}`,
        );
      },
    }),
  });

  private init(fieldName: string = 'image') {
    AWS.config.update({
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      region: process.env.AWS_REGION_CODE,
    });
    targetFolder = fieldName;
  }

  async baseUpload(
    request: any,
    response: any,
    fieldName: string,
  ): Promise<IResponse> {
    this.init(fieldName);
    const upload = this.upload.single(fieldName);
    try {
      await upload(request, response, err => {
        if (err) {
          return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
            summary: 'An error has occurred. Please see details below.',
            success: false,
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            error: {
              timestamp: new Date(),
              path: request.url,
              method: request.method,
              message: `${err.message}`,
            },
          });
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
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        summary: 'An error has occurred. Please see details below.',
        success: false,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: {
          timestamp: new Date(),
          path: request.url,
          method: request.method,
          message: `${error.message}`,
        },
      });
    }
  }

  async imageUpload(request: any, response: any): Promise<any> {
    await this.baseUpload(request, response, 'image');
  }

  async avatarUpload(request: any, response: any): Promise<any> {
    await this.baseUpload(request, response, 'avatar');
  }
}
