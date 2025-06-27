"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (error, req, res, next) => {
    var _a, _b;
    if (error.name === "UnauthorizedError") {
        res.status(401).send("invalid token...");
    }
    const status = typeof error.code === "number" && Number.isInteger(error.code)
        ? error.code
        : 500;
    console.error(error);
    res.status(status).json({
        path: req.path,
        method: req.method,
        message: (_a = error.message) !== null && _a !== void 0 ? _a : "Internal Server Error",
        data: (_b = error.data) !== null && _b !== void 0 ? _b : undefined,
        date: new Date(),
    });
};
exports.default = errorHandler;
//# sourceMappingURL=errorHandler.js.map