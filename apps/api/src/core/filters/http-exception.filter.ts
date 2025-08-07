import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ApiResponse } from '@repo/schema';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse: ApiResponse<null> = {
      success: false,
      status,
      error: {
        message:
          typeof exceptionResponse === 'object'
            ? (exceptionResponse as any).message
            : exceptionResponse,
        code: (exceptionResponse as any).code,
      },
    };

    response.status(status).json(errorResponse);
  }
}
