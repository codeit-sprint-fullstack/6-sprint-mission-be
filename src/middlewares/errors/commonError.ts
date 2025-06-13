import { ErrorRequestHandler } from "express";

const commonError: ErrorRequestHandler = (err, req, res, next) => {
  switch (err.name) {
    case "ValidationError":
      res
        .status(400)
        .send({ message: "ValidationError : body의 내용이 빠졌습니다!" });
      break;
    case "CastError":
      res.status(400).send({ message: "Invalid product ID" });
      break;
    case "UnauthorizedError":
      res
        .status(401)
        .json({ message: "인증에 실패했습니다. 다시 로그인해주세요." });
    default:
      res.status(500).send({ message: err.message });
  }
};

export default commonError;
