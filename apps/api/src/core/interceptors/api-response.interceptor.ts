// src/interceptors/api-response.interceptor.ts

import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { BusinessError } from '@repo/core';
import { ApiResponse } from '@repo/schema';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ApiResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse();

    return next.handle().pipe(
      map((data) => {
        const status = response.statusCode || HttpStatus.OK;

        return {
          success: true,
          status,
          data,
        };
      }),
      catchError((error) => {
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let code: string | undefined;
        let details: any = undefined;

        if (error instanceof BusinessError) {
          status = error.status || HttpStatus.BAD_REQUEST;
          message = error.message;
          code = error.code;
          details = error.details;
        } else if (error.response) {
          // Handle HTTP exceptions
          status = error.response.statusCode || status;
          message = error.response.message || message;
        }

        response.status(status);

        throw {
          success: false,
          status,
          error: {
            message,
            ...(code && { code }),
            ...(details && { details }),
          },
        };
      }),
    );
  }
}
