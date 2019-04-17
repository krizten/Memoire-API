import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { FileLogger } from './file-logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next$: Observable<any>,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const now = Date.now();

    return next$.pipe(
      tap(() => {
        FileLogger.log({
          method: request.method,
          path: request.url,
          duration: `${Date.now() - now}ms`,
          context: context.getClass().name,
        });

        Logger.log(
          `${request.method} ${request.url} ${Date.now() - now}ms`,
          context.getClass().name,
        );
      }),
    );
  }
}
