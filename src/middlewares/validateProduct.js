function validateProduct(req, res, next) {
  const { name, description, price } = req.body;

  if (!name || !description || !price) {
    const error = new Error("제품 이름, 설명, 가격은 필수 입력 항목입니다.");
    error.code = 400;
    throw error;
  }

  if (isNaN(price)) {
    const error = new Error("가격은 숫자로 작성해 주세요.");
    error.code = 400;
    throw error;
  }

  if (parseInt(price, 10) <= 0) {
    const error = new Error("가격은 0보다 커야 합니다.");
    error.code = 400;
    throw error;
  }

  next();
}

module.exports = validateProduct;
