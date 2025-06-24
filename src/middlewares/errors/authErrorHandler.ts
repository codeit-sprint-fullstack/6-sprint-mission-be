import { ErrorRequestHandler } from "express";

/**
 * 인증 관련 에러를 처리하는 미들웨어
 * userService에서 throw한 에러를 처리합니다.
 * error.code 속성에 따라 적절한 HTTP 상태 코드로 응답합니다.
 */
export const authErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // 로그 기록 (디버깅용)
  console.log("Auth Error Handler:", err);

  // 상태 코드별 에러 처리
  switch (err.code) {
    // 인증 관련 에러 (로그인 실패, 비밀번호 불일치, 토큰 만료 등)
    case 401:
      res.status(401).json({ message: err.message });
      break;

    // 권한 부족 에러 (접근 권한 없음)
    case 403:
      res.status(403).json({
        message: err.message || "해당 작업에 대한 권한이 없습니다.",
      });
      break;

    // 리소스 없음 에러 (사용자 찾을 수 없음 등)
    case 404:
      res.status(404).json({ message: err.message });
      break;

    // 중복 데이터 에러 (이미 존재하는 이메일 등)
    case 422:
      res.status(422).json({
        message: err.message,
        data: err.data,
      });
      break;

    // expressjwt의 UnauthorizedError 처리
    default:
      if (err.name === "UnauthorizedError") {
        res.status(401).json({
          message: "인증에 실패했습니다. 다시 로그인해주세요.",
        });
        break;
      }

      // 다른 에러는 다음 에러 핸들러로 전달
      next(err);
  }
};

export default authErrorHandler;
