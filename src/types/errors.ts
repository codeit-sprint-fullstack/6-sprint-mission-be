export class HttpError extends Error {
  statusCode?: number;
  data?: any;

  constructor(message: string, statusCode?: number, data?: any) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    this.name = this.constructor.name;
  }
}

export class ValidationError extends HttpError {
  constructor(message: string, data?: any) {
    super(message, 422, data); // 422는 기본값
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends HttpError {
  constructor(message: string, data?: any) {
    super(message, 401, data); // 401은 기본값
    this.name = "AuthenticationError";
  }
}

export class ServerError extends HttpError {
  constructor(message: string, data?: any) {
    super(message, 500, data); // 500은 기본값
    this.name = "ServerError";
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string, data?: any) {
    super(message, 404, data); // 404은 기본값
    this.name = "NotFoundError";
  }
}

export class ForbiddenError extends HttpError {
  constructor(message: string, data?: any) {
    super(message, 403, data); // 403은 기본값
    this.name = "ForbiddenError";
  }
}

export class RequestError extends HttpError {
  constructor(message: string, data?: any) {
    super(message, 400, data); // 400은 기본값
    this.name = "BadRequest";
  }
}

export class ExistError extends HttpError {
  constructor(message: string, data?: any) {
    super(message, 409, data); // 409은 기본값
    this.name = "AlreadyExist";
  }
}
