"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExistError = exports.RequestError = exports.ForbiddenError = exports.NotFoundError = exports.ServerError = exports.AuthenticationError = exports.ValidationError = exports.HttpError = void 0;
class HttpError extends Error {
    constructor(message, statusCode, data) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
        this.name = this.constructor.name;
    }
}
exports.HttpError = HttpError;
class ValidationError extends HttpError {
    constructor(message, data) {
        super(message, 422, data); // 422는 기본값
        this.name = "ValidationError";
    }
}
exports.ValidationError = ValidationError;
class AuthenticationError extends HttpError {
    constructor(message, data) {
        super(message, 401, data); // 401은 기본값
        this.name = "AuthenticationError";
    }
}
exports.AuthenticationError = AuthenticationError;
class ServerError extends HttpError {
    constructor(message, data) {
        super(message, 500, data); // 500은 기본값
        this.name = "ServerError";
    }
}
exports.ServerError = ServerError;
class NotFoundError extends HttpError {
    constructor(message, data) {
        super(message, 404, data); // 404은 기본값
        this.name = "NotFoundError";
    }
}
exports.NotFoundError = NotFoundError;
class ForbiddenError extends HttpError {
    constructor(message, data) {
        super(message, 403, data); // 403은 기본값
        this.name = "ForbiddenError";
    }
}
exports.ForbiddenError = ForbiddenError;
class RequestError extends HttpError {
    constructor(message, data) {
        super(message, 400, data); // 400은 기본값
        this.name = "BadRequest";
    }
}
exports.RequestError = RequestError;
class ExistError extends HttpError {
    constructor(message, data) {
        super(message, 409, data); // 409은 기본값
        this.name = "AlreadyExist";
    }
}
exports.ExistError = ExistError;
//# sourceMappingURL=errors.js.map