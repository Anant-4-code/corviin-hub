/** Standard API success response wrapper */
export class ApiSuccessResponse<T> {
  data: T;
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    hasNextPage: boolean;
  };

  constructor(data: T, meta?: ApiSuccessResponse<T>['meta']) {
    this.data = data;
    this.meta = meta;
  }
}

/** Standard API error response */
export class ApiErrorResponseDto {
  statusCode: number;
  code: string;
  message: string;
  requestId?: string;

  constructor(statusCode: number, code: string, message: string) {
    this.statusCode = statusCode;
    this.code = code;
    this.message = message;
  }
}
