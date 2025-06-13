import { RequestHandler } from "express";
import { BadRequestError } from "../types/errors";

type TRequiredData = {
  name: string;
  description: string;
  price: number;
  tags: string;
};

const requiredDataValidate: RequestHandler<{}, {}, TRequiredData> = (
  req,
  res,
  next
) => {
  try {
    const { name, description, price, tags } = req.body;

    if (!name || !description || !price || !tags) {
      throw new BadRequestError("필수 항목을 모두 입력해주세요.");
    }

    if (10 < name.length) {
      throw new BadRequestError("이름은 10글자 이내로 입력해주세요.");
    }

    if (10 > description.length || 100 < description.length) {
      throw new BadRequestError("설명은 10 ~ 100글자 이내로 입력해주세요.");
    }

    if (typeof Number(price) !== "number") {
      throw new BadRequestError("가격은 숫자만 입력해주세요.");
    }

    (JSON.parse(tags) as string[]).map((tag) => {
      if (Boolean(5 < tag.length)) {
        throw new BadRequestError("태그는 5글자 이내로 입력해주세요.");
      }
    });

    next();
  } catch (e) {
    next(e);
  }
};

export default requiredDataValidate;
