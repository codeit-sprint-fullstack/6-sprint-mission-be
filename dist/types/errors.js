"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = exports.NotFoundError = exports.ServerError = exports.AuthenticationError = exports.ValidationError = exports.HttpError = void 0;
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
//# sourceMappingURL=errors.js.map