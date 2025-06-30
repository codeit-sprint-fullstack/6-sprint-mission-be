"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (error, req, res, next) => {
    var _a, _b, _c;
    //expressjwt를 위한 예외처리
    if (error.name === "UnauthorizedError") {
        res.status(401).send("invalid token...");
        return;
    }
    const status = (_a = error.code) !== null && _a !== void 0 ? _a : 500;
    console.error(error);
    res.status(status).json({
        path: req.path,
        method: req.method,
        message: (_b = error.message) !== null && _b !== void 0 ? _b : "Internal Server Error",
        data: (_c = error.data) !== null && _c !== void 0 ? _c : undefined,
        date: new Date(),
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map