import { Catch, ExceptionFilter, HttpException, ArgumentsHost, Logger, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

import { IResponse } from '../interfaces/response.interface';
import { FileLogger } from './file-logger.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse: IResponse = {
      summary: 'An error has occurred. Please see details below.',
      success: false,
      status,
      error: {
        timestamp: new Date(),
        path: request.url,
        method: request.method,
        message: (status !== HttpStatus.INTERNAL_SERVER_ERROR) ? (exception.message || null) : 'Internal Server Error',
      },
    };

    Logger.error(
      `${request.method} ${request.url}`,
      JSON.stringify(errorResponse),
      'ExceptionFilter',
    );

    FileLogger.error({
      request: `${request.method} ${request.url}`,
      response: errorResponse,
    });

    response.status(status).json(errorResponse);
  }
}
