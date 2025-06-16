"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const prismaClient_1 = __importDefault(require("../models/prisma/prismaClient"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const auth = (0, catchAsync_1.default)(async (req, res, next) => {
    let accessToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        accessToken = req.headers.authorization.split(' ')[1];
    }
    if (!accessToken) {
        throw new apiError_1.default(401, 'Please authenticate');
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(accessToken, config_1.default.jwtSecret);
        const user = await prismaClient_1.default.user.findUnique({
            where: { id: decoded.userId },
        });
        if (!user) {
            throw new apiError_1.default(401, 'User not found');
        }
        req.user = user;
        next();
    }
    catch (error) {
        throw new apiError_1.default(401, 'Invalid token');
    }
});
exports.default = auth;
