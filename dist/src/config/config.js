"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const config = {
    port: parseInt(process.env.PORT || '5050', 10),
    jwtSecret: process.env.JWT_SECRET || "your-secret-key",
    jwtExpiration: process.env.JWT_EXPIRATION || "1h",
};
exports.default = config;
