// src/interceptors/api-response.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        status: context.switchToHttp().getResponse().statusCode,
        data,
      })),
      catchError((err) => {
        // If error is already formatted, pass it through
        if (err.response?.success === false) {
          return throwError(() => err);
        }

        // Otherwise create a properly formatted error
        const status = err.status || 500;
        const response = {
          success: false,
          status,
          error: {
            message: err.message || 'Internal server error',
            code: err.code || `HTTP_${status}`,
            ...(err.details && { details: err.details }),
          },
        };

        // Attach to the error object
        err.response = response;
        return throwError(() => err);
      }),
    );
  }
}
