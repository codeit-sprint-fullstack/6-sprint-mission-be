"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.JWT_SECRET || "panda-secret";
function generateToken(user) {
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, SECRET_KEY, {
        expiresIn: "7d",
    });
}
