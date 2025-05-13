export const validateProduct = (req, res, next) => {
  const { name, description, price } = req.body;

  if (!name || !description || price === undefined) {
    return res.status(400).json({ message: "이름, 설명, 가격은 필수입니다." });
  }

  // 문자열을 숫자로 변환
  const priceNumber = Number(price);

  if (isNaN(priceNumber) || priceNumber <= 0) {
    return res
      .status(400)
      .json({ message: "가격은 0보다 큰 숫자여야 합니다." });
  }

  // 변환된 숫자를 다시 req.body에 설정
  req.body.price = priceNumber;

  next();
};
