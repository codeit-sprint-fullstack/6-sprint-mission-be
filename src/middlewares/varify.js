import prisma from "../config/client.prisma.js";

//잘못된 요청을 보낸 경우 400 Bad request 에러를 발생
function throwBadRequestError() {
  const error = new Error("Bad Request, 필수 정보가 누락되었습니다.");
  error.code = 400;
  throw error;
}

//정보가 없는 경우 404 Not Found 에러를 발생
function throwNotFoundError() {
  const error = new Error("Not Found, 상품 정보를 찾을 수 없습니다.");
  error.code = 404;
  throw error;
}

//상품 등록 req에 필수 정보의 여부 확인
async function requestStructure(req, res, next) {
  const { name, description, price, tags, images } = req.body;

  if (!name || !description || !price || !tags || !images) {
    throwBadRequestError();
  }
  next();
}

//회원가입 req에 필수 정보의 여부 확인
async function signUpRequestStructure(req, res, next) {
  const { email, nickname, password } = req.body;

  if (!email || !nickname || !password) {
    throwBadRequestError();
  }
  next();
}

//회원가입 사용 중인 이메일인지 체크
async function checkExistedEmail(req, res, next) {
  const existingUser = await prisma.user.findUnique({
    where: { email: req.body.email },
  });

  if (existingUser) {
    const error = new Error("이미 사용 중인 이메일입니다.");
    error.code = 409;
    throw error;
  }
  next();
}

export default {
  requestStructure,
  throwNotFoundError,
  signUpRequestStructure,
  checkExistedEmail,
};
