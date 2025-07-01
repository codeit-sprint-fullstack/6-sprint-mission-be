import { User } from "@prisma/client";
import authRepository from "../repositories/authRepository";
import jwt from "jsonwebtoken";
import { CreateUserDto, CreateUserSchema, EmailSchema } from "../dto/auth.dto";
import { ValidationError } from "../types/errors";
import authService from "./authService";

jest.mock("../repositories/authRepository");
jest.mock("jsonwebtoken");

const mockAuthRepo = authRepository as jest.Mocked<typeof authRepository>;
const mockJwt = jwt as jest.Mocked<typeof jwt>;

test("데이터를 받아서 user를 생성한다.", async () => {
  const user = {
    id: 1,
    email: "test@test.com",
    encryptedPassword: "test",
    nickname: "test user",
    image: null,
  };

  const mockUser = {
    ...user,
    createdAt: new Date("2023-01-01T00:00:00.000Z"),
    updatedAt: new Date("2023-01-01T00:00:00.000Z"),
  };

  mockAuthRepo.save.mockResolvedValue(mockUser);

  const result = await authService.create(user);

  expect(mockAuthRepo.save).toHaveBeenCalledWith(mockUser);
  expect(result).toStrictEqual(mockUser);
});

// async function create(user: CreateUserDto) {
//   const parsed = CreateUserSchema.safeParse(user);
//   if (!parsed.success) throw new ValidationError("형식이 유효하지 않습니다.");

//   return await authRepository.save(parsed.data);
// }

// function createAccessToken(user: User["id"]) {
//   const secretKey = `${process.env.JWT_SECRET_KEY}`;
//   const payload = { userId: user };

//   return jwt.sign(payload, secretKey, {
//     expiresIn: "1h",
//   });
// }

// function createRefreshToken(user: User["id"]) {
//   const secretKey = `${process.env.JWT_REFRESH_SECRET_KEY}`;
//   const payload = { userId: user };

//   return jwt.sign(payload, secretKey, {
//     expiresIn: "1h",
//   });
// }

// async function getByEmail(email: User["email"]): Promise<User | null> {
//   const parsed = EmailSchema.safeParse(email);
//   if (!parsed.success) throw new ValidationError("잘못된 이메일 형식입니다.");

//   return await authRepository.findByEmail(parsed.data);
// }

// export default {
//   create,
//   createAccessToken,
//   createRefreshToken,
//   getByEmail,
// };
