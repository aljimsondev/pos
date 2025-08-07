import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const name = exception.name || 'AppError';

    // Use the formatted response if it exists
    if (exception.response?.success === false) {
      const formattedResponse = {
        ...exception.response,
        error: {
          ...exception.response.error,
          name,
          path: request.url,
          timestamp: new Date().toISOString(),
        },
      };
      return response.status(exception.response.status).json(formattedResponse);
    }

    // Default error handling
    const status = exception.getStatus?.() || 500;
    const message = exception.message || 'Internal server error';
    const code = exception.code || `HTTP_${status}`;

    response.status(status).json({
      success: false,
      status,
      error: {
        name,
        message,
        code,
        path: request.url,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
