import { body, ValidationError, validationResult } from "express-validator";
import { BadRequestError } from "../types/exceptions";
import { NextFunction, Request, Response } from "express";

export function validator(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorArr = errors.array() as ValidationError[];

    const validationErrors: Record<string, { message: string; value: any }> =
      {};
    errorArr.forEach((err) => {
      if (err.type === "field") {
        validationErrors[`body.${err.path}`] = {
          message: err.msg,
          value: err.value,
        };
      }
    });
    const errorMsg = errorArr[0]?.msg || "Validation Failed";

    return next(new BadRequestError(errorMsg, validationErrors));
  }

  next();
}

// TODO: 에러 메세지 상수 분리
// 회원가입 유효성 검사
export const signUpValidator = [
  body("email")
    .isEmail()
    .withMessage(
      "Not match in '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    )
    .normalizeEmail(),
  body("nickname").isLength({ min: 1 }).withMessage("minLength 1"),
  body("password").isLength({ min: 8 }).withMessage("minLength 8"),
  body("passwordConfirmation")
    .notEmpty()
    .withMessage("비밀번호 확인을 입력해주세요.")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("비밀번호가 일치하지 않습니다.");
      }
      return true;
    }),
];

// 로그인 유효성 검사
export const signInValidator = [
  body("email")
    .isEmail()
    .withMessage("잘못된 이메일 형식입니다.")
    .normalizeEmail(),
  body("password").isLength({ min: 8 }).withMessage("minLength 8"),
];

// 상품 등록 및 수정 유효성 검사
export const productValidator = [
  body("name")
    .notEmpty()
    .withMessage("상품명을 입력해주세요.")
    .isLength({ max: 10 })
    .withMessage("상품명을 10자 이내로 입력해주세요."),
  body("description")
    .isLength({ min: 10 })
    .withMessage("설명을 10자 이상 입력해주세요."),
  body("price")
    .isInt({ min: 0 })
    .withMessage("가격을 0 이상 숫자로 입력해주세요."),
];

// 게시글 등록 및 수정 유효성 검사
export const articleValidator = [
  body("title").notEmpty().withMessage("게시글 제목을 작성해주세요."),
  body("content")
    .isLength({ min: 10 })
    .withMessage("게시글 내용을 10자 이상 작성해주세요."),
];

// 댓글 등록 및 수정 유효성 검사
export const commentValidator = [
  body("content").notEmpty().withMessage("댓글 내용을 입력해주세요."),
];
