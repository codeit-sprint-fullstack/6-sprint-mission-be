import { NextFunction, Request, Response } from "express";
import prisma from "../config/client.prisma";
import { ExistError, NotFoundError, RequestError } from "../types/errors";

//잘못된 요청을 보낸 경우 400 Bad request 에러를 발생
function throwBadRequestError() {
  throw new RequestError("Bad Request, 필수 정보가 누락되었습니다.");
}

//정보가 없는 경우 404 Not Found 에러를 발생
function throwNotFoundError() {
  throw new NotFoundError("Not Found, 상품 정보를 찾을 수 없습니다.");
}

//상품 등록 req에 필수 정보의 여부 확인
async function requestStructure(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, description, price, tags, images } = req.body;

  if (!name || !description || !price || !tags || !images) {
    throwBadRequestError();
  }
  next();
}

interface verifySignup {
  email: string;
  nickname: string;
  password: number;
}

//회원가입 req에 필수 정보의 여부 확인
async function signUpRequestStructure(
  req: Request<{}, {}, verifySignup>,
  res: Response,
  next: NextFunction
) {
  const { email, nickname, password } = req.body;

  if (!email || !nickname || !password) {
    throwBadRequestError();
  }
  next();
}

//회원가입 사용 중인 이메일인지 체크
async function checkExistedEmail(
  req: Request<{}, {}, verifySignup>,
  res: Response,
  next: NextFunction
) {
  const existingUser = await prisma.user.findUnique({
    where: { email: req.body.email },
  });

  if (existingUser) {
    throw new ExistError("이미 사용 중인 이메일입니다.");
  }
  next();
}

export default {
  requestStructure,
  throwNotFoundError,
  signUpRequestStructure,
  checkExistedEmail,
};
