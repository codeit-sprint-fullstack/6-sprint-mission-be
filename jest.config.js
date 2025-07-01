// jest.config.js
module.exports = {
  preset: 'ts-jest', // ts-jest 프리셋을 사용하여 TypeScript 파일 처리
  testEnvironment: 'node', // 백엔드 테스트이므로 node 환경 사용
  testMatch: [
    '**/__tests__/**/*.ts', // __tests__ 디렉토리 하위의 .ts 파일을 테스트 파일로 인식
    '**/?(*.)+(spec|test).ts' // .spec.ts 또는 .test.ts 확장자를 가진 파일을 테스트 파일로 인식
  ],
  // 모듈 해상도에 필요한 alias (선택 사항)
  moduleNameMapper: {
    // 예: @src/alias 경로를 src/ 경로로 매핑 (프로젝트 구조에 따라 필요할 수 있음)
    // '^@src/(.*)$': '<rootDir>/src/$1',
  },
  // 코드 커버리지 설정 (선택 사항)
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts', // src 디렉토리의 모든 .ts 파일에서 커버리지 수집
    '!src/**/*.d.ts', // 타입 정의 파일은 제외
    '!src/models/prisma/*', // Prisma 생성 파일 등은 제외 (필요에 따라)
  ],
};