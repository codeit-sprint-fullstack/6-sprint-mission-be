import { body, validationResult } from "express-validator";
import { BadRequestError } from "../exceptions.js";

export const createProductValidator = [
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

export function validator(req, res, next) {
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
