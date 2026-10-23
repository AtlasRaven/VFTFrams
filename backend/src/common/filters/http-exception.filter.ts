import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody = exception.getResponse();
      if (typeof responseBody === 'string') {
        message = responseBody;
      } else {
        const responseMessage =
          'message' in responseBody ? responseBody.message : undefined;
        if (typeof responseMessage === 'string') {
          message = responseMessage;
        } else if (
          Array.isArray(responseMessage) &&
          responseMessage.every((detail) => typeof detail === 'string')
        ) {
          message = responseMessage.join(', ');
        }
      }
    } else {
      console.error('Unhandled API exception:', exception);
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      data: null,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
