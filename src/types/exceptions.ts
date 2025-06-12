// TODO: 추가 검토
export class HttpError extends Error {
  status: number;
  details?: any;

  constructor(status: number = 500, message?: string, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
    this.name = "HttpError";
  }
}

export class BadRequestError extends HttpError {
  constructor(message?: string, details?: any) {
    super(400, message, details);
    this.name = "Bad Request";
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message?: string, details?: any) {
    super(401, message, details);
    this.name = "Unauthorized";
  }
}

export class ForbiddenError extends HttpError {
  constructor(message?: string, details?: any) {
    super(403, message, details);
    this.name = "Forbidden";
  }
}

export class NotFoundError extends HttpError {
  constructor(message?: string, details?: any) {
    super(404, message, details);
    this.name = "Not Found";
  }
}
