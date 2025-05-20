export function validateProductInputs(req, res, next) {
  const { name, description, price } = req.body;
  
  const errors = {};
  
  if (!name || name.trim() === '') {
    errors.name = "상품명은 필수입니다.";
  } else if (name.length < 2 || name.length > 50) {
    errors.name = "상품명은 2-50자 사이여야 합니다.";
  }
  
  if (!description || description.trim() === '') {
    errors.description = "상품 설명은 필수입니다.";
  } else if (description.length < 10) {
    errors.description = "상품 설명은 최소 10자 이상이어야 합니다.";
  }
  
  if (!price) {
    errors.price = "가격은 필수입니다.";
  } else if (isNaN(Number(price)) || Number(price) <= 0) {
    errors.price = "가격은 양수여야 합니다.";
  }
  
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ 
      message: "입력값 검증 실패", 
      errors 
    });
  }
  
  next();
}

export function validateProductImages(req, res, next) {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ 
      message: "이미지를 1장 이상 업로드해야 합니다." 
    });
  }
  
  if (req.files.length > 3) {
    return res.status(400).json({ 
      message: "이미지는 최대 3장까지 업로드 가능합니다." 
    });
  }
  
  next();
}