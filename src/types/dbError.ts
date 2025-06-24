// src/types/errors.ts
export class AppError extends Error {
  code?: number; // 선택적 속성으로 변경
  data?: any; // 에러핸들러에서 사용하는 data 속성도 추가

  constructor(message: string, code?: number, data?: any) {
    super(message);
    this.code = code;
    this.data = data;
    this.name = "AppError";
  }
}

// 자주 사용하는 에러들을 위한 편의 클래스들
export class P2025Error extends AppError {
  constructor(message: string, data?: any) {
    super(message, 500, data);
    this.name =
      "An operation failed because it depends on one or more records that were required but not found. {cause}";
  }
}

export class P2002Error extends AppError {
  constructor(message: string, data?: any) {
    super(message, 500, data);
    this.name = "Unique constraint failed on the {constraint}";
  }
}
