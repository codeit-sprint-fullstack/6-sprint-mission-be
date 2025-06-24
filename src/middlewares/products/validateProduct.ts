import { NextFunction, Request, Response } from "express";

export const validateProduct = (
  req: Request<
    {},
    {},
    {
      name?: string;
      description?: string;
      price?: number | string;
      existingImages?: string;
      tags?: string | string[];
    }
  >,
  res: Response,
  next: NextFunction
) => {
  const { name, description, price } = req.body;

  if (!name || !description || price === undefined) {
    res.status(400).json({ message: "이름, 설명, 가격은 필수입니다." });
    return;
  }

  // 문자열을 숫자로 변환
  const priceNumber = Number(price);

  if (isNaN(priceNumber) || priceNumber <= 0) {
    res.status(400).json({ message: "가격은 0보다 큰 숫자여야 합니다." });
    return;
  }

  // 변환된 숫자를 다시 req.body에 설정
  req.body.price = priceNumber;

  next();
};
