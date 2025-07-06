import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import {
  filterSensitiveUserData,
  hashPassword,
  verifyPassword,
} from "./auth.utils";

describe("인증 유틸 함수 유닛 테스트", () => {
  describe("민감한 정보 필터링 테스트", () => {
    test("유저 객체에서 비밀번호와 리프레시 토큰을 제외해야 한다", () => {
      const user = {
        id: "user1",
        email: "test@example.com",
        nickname: "test",
        image: null,
        hashedPassword: "hashed_password",
        refreshToken: "refresh_token",
        provider: "credentials",
        providerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } satisfies User;

      const filtered = filterSensitiveUserData(user);

      expect(filtered).not.toHaveProperty("hashedPassword");
      expect(filtered).not.toHaveProperty("refreshToken");
      expect(filtered).toHaveProperty("email", user.email);
      expect(filtered).toHaveProperty("nickname", user.nickname);
    });
  });

  describe("비밀번호 해싱 테스트", () => {
    test("입력받은 비밀번호를 해시값으로 반환해야 한다", async () => {
      const password = "test1234";
      const hashed = await hashPassword(password);

      expect(typeof hashed).toBe("string");
      expect(hashed).not.toBe(password);
      expect(hashed.length).toBeGreaterThan(0);
    });
  });

  describe("비밀번호 검증 테스트", () => {
    test("입력받은 비밀번호가 DB의 유저 비밀번호와 일치하면 true를 반환해야 한다", async () => {
      const password = "test1234";
      const hashed = await bcrypt.hash(password, 10);

      const isValid = await verifyPassword(password, hashed);
      expect(isValid).toBe(true);
    });

    test("입력받은 비밀번호가 DB의 유저 비밀번호와 일치하지 않으면 false를 반환해야 한다", async () => {
      const password = "test1234";
      const wrongPassword = "test123";
      const hashed = await bcrypt.hash(password, 10);

      const isValid = await verifyPassword(wrongPassword, hashed);
      expect(isValid).toBe(false);
    });
  });
});
