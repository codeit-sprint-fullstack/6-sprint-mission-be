"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const app_1 = __importDefault(require("./app")); // <-- app.ts에서 내보낸 app 객체를 가져옵니다.
const config_1 = __importDefault(require("./config/config")); // './config/config.js'
const server = app_1.default.listen(config_1.default.port, () => {
    console.log(`Server listening on port ${config_1.default.port}`);
});
// 프로세스 종료 시 서버 정리 (선택 사항)
const exitHandler = () => {
    if (server) {
        server.close(() => {
            console.log('Server closed');
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
};
const unexpectedErrorHandler = (error) => {
    console.error('Unhandled error:', error);
    exitHandler();
};
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
process.on('SIGTERM', () => {
    console.log('SIGTERM received');
    if (server) {
        server.close();
    }
});
