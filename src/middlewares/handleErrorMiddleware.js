function handleError(err, req, res, next) {
  switch (err.name) {
    case "ValidationError":
      res.status(400).send({ message: "유효성 검증 실패하였습니다." });
      break;
    case "CastError":
      res.status(400).send({ message: "잘못된 데이터가 입력되었습니다." });
      break;
    case "ReferenceError":
      res.status(500).send({ message: "참조할 수 없습니다." });
      break;
    default:
      res.send({ message: err.message });
      break;
  }
}

// 개발용 에러 미들웨어
// function handleError(err, req, res, next) {
//   const message = err.message;

//   res.send(message);
// }

export default handleError;
