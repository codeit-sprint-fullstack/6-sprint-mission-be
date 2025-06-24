// src/server.ts
import app from "./app"; // <-- app.ts에서 내보낸 app 객체를 가져옵니다.
import config from "./config/config"; // './config/config.js'

const server = app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});

// 프로세스 종료 시 서버 정리 (선택 사항)
const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: Error) => {
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