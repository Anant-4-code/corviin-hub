import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

export interface StandardErrorResponse {
  statusCode: number;
  code: string;
  message: string;
  details: string[] | Record<string, any>[];
  timestamp: string;
  path: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_SERVER_ERROR';
    let message = 'An unexpected server error occurred.';
    let details: string[] | Record<string, any>[] = [];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const obj = res as Record<string, any>;
        message = obj.message || exception.message;
        code = obj.code || this.mapStatusToCode(status);
        if (Array.isArray(obj.message)) {
          details = obj.message;
          message = 'Validation failed for the supplied payload.';
          code = 'VALIDATION_ERROR';
        } else if (obj.details) {
          details = Array.isArray(obj.details) ? obj.details : [obj.details];
        }
      }
    } else if (exception instanceof Error) {
      // Avoid leaking internal database or system error traces
      this.logger.error(`Unhandled error at ${request.url}: ${exception.message}`, exception.stack);
      message = 'An unexpected internal error occurred.';
    }

    const errorPayload: StandardErrorResponse = {
      statusCode: status,
      code,
      message,
      details,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorPayload);
  }

  private mapStatusToCode(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'BAD_REQUEST';
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHORIZED';
      case HttpStatus.FORBIDDEN:
        return 'FORBIDDEN';
      case HttpStatus.NOT_FOUND:
        return 'RECORD_NOT_FOUND';
      case HttpStatus.CONFLICT:
        return 'CONFLICT';
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return 'UNPROCESSABLE_ENTITY';
      default:
        return 'SERVER_ERROR';
    }
  }
}

