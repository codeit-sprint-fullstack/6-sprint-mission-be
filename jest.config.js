// jest.config.js
module.exports = {
  testEnvironment: 'node', // 백엔드 서버는 Node.js 환경에서 실행되므로 'node'로 설정합니다.
  testMatch: [
    '**/__tests__/**/*.ts', // __tests__ 디렉토리 하위의 TS 파일을 테스트 파일로 인식
    '**/?(*.)+(spec|test).ts' // .spec.ts 또는 .test.ts 확장자를 가진 파일을 테스트 파일로 인식
  ],
  // 필요에 따라 다음 옵션들을 추가할 수 있습니다.
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // 각 테스트 파일 실행 전 특정 설정 파일 로드
  // collectCoverage: true, // 코드 커버리지 수집 여부
  // coverageDirectory: 'coverage', // 커버리지 보고서 저장 디렉토리
};