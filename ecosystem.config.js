module.exports = {
  apps: [
    {
      name: "panda-server", // PM2에서 표시될 이름
      script: "dist/app.js", // 빌드 후 실행할 진입점
      instances: 1, // fork 모드 (단일 인스턴스)
      exec_mode: "fork", // 'cluster'로 변경 시 멀티코어 사용 가능
      watch: false, // 코드 변경 시 자동 재시작 여부 (운영에서는 false)
      env: {
        NODE_ENV: "development", // 기본 환경
        PORT: 7777,
      },
      env_production: {
        NODE_ENV: "production", // 배포(운영) 환경
        PORT: 7777,
      },
    },
  ],
};
