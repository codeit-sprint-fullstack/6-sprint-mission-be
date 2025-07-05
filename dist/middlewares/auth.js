"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_jwt_1 = require("express-jwt");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// function throwUnauthorizedError() {
//   const error = new Error("Unauthorized");
//   error.code = 401;
//   throw error;
// }
const verifyAccessToken = (0, express_jwt_1.expressjwt)({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    requestProperty: "auth", //필요?
});
const verifyRefreshToken = (0, express_jwt_1.expressjwt)({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    getToken: (req) => {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return undefined;
        return authHeader.split(" ")[1];
    },
});
exports.default = {
    verifyAccessToken,
    verifyRefreshToken,
};
//# sourceMappingURL=auth.js.map