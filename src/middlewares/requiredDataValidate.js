export default function requiredDataValidate(req, res, next) {
  try {
    const { name, description, price, tags } = req.body;

    if (!name || !description || !price || !tags) {
      const error = new Error("필수 항목을 모두 입력해주세요.");
      error.code = 400;

      throw error;
    }

    if (10 < name.length) {
      const error = new Error("이름은 10글자 이내로 입력해주세요.");
      error.code = 400;

      throw error;
    }

    if (10 > description.length || 100 < description.length) {
      const error = new Error("설명은 10 ~ 100글자 이내로 입력해주세요.");
      error.code = 400;

      throw error;
    }

    if (!+price) {
      const error = new Error("가격은 숫자만 입력해주세요.");
      error.code = 400;

      throw error;
    }

    tags.map((tag) => {
      if (Boolean(5 < tag.length)) {
        const error = new Error("태그는 5글자 이내로 입력해주세요.");
        error.code = 400;

        throw error;
      }
    });

    next();
  } catch (e) {
    next(e);
  }
}
