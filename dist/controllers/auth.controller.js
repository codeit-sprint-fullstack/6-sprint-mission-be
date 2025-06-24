"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signIn = exports.signUp = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaClient_1 = __importDefault(require("../models/prisma/prismaClient"));
const config_1 = __importDefault(require("../config/config"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
function generateToken(userId) {
    const signOptions = {
        expiresIn: config_1.default.jwtExpiration,
    };
    return jsonwebtoken_1.default.sign({ userId }, config_1.default.jwtSecret, signOptions);
}
exports.signUp = (0, catchAsync_1.default)(async (req, res) => {
    if (await prismaClient_1.default.user.findUnique({ where: { email: req.body.email } })) {
        throw new apiError_1.default(400, 'Email already taken');
    }
    const hashedPassword = await bcrypt_1.default.hash(req.body.password, 10);
    const user = await prismaClient_1.default.user.create({
        data: { ...req.body, password: hashedPassword },
    });
    res.status(201).send(user);
});
exports.signIn = (0, catchAsync_1.default)(async (req, res) => {
    const { email, password } = req.body;
    const user = await prismaClient_1.default.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt_1.default.compare(password, user.password))) {
        throw new apiError_1.default(401, 'Incorrect email or password');
    }
    const accessToken = generateToken(user.id);
    res.send({ accessToken, user });
});
