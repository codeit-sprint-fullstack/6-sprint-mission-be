import { body, validationResult } from "express-validator";
import { BadRequestError } from "../exceptions.js";

export function validate(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const validationErrors = {};
    errors.array().forEach((err) => {
      validationErrors[`body.${err.path}`] = {
        message: err.msg,
        value: err.value,
      };
    });
    return next(new BadRequestError("Validation Failed", validationErrors));
  }

  next();
}

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
    .withMessage(
      "Not match in '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    )
    .normalizeEmail(),
  body("password").isLength({ min: 8 }).withMessage("minLength 8"),
];

// 상품 등록 및 수정 유효성 검사
export const productValidator = [
  body("name")
    .notEmpty()
    .withMessage("상품명을 입력해주세요.")
    .isLength({ max: 10 })
    .withMessage("10자 이내로 입력해주세요."),
  body("description")
    .notEmpty()
    .withMessage("설명을 입력해주세요.")
    .isLength({ min: 10 })
    .withMessage("10자 이상 입력해주세요."),
  body("price")
    .notEmpty()
    .withMessage("가격을 입력해주세요.")
    .isInt({ min: 0 })
    .withMessage("0 이상 숫자로 입력해주세요."),
];

// 댓글 등록 및 수정 유효성 검사
export const commentValidator = [
  body("content").notEmpty().withMessage("댓글 내용을 입력해주세요."),
];
