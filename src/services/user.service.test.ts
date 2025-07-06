import userService from "../services/user.service";
import userRepository from "../repositories/user.repository";
import * as authUtils from "../utils/auth.utils";

jest.mock("../repositories/user.repository");
jest.mock("../utils/auth.utils");

describe("UserService 유닛 테스트", () => {
  const mockUser = {
    id: "user1",
    email: "test@example.com",
    nickname: "test",
    hashedPassword: "hashed_password",
    refreshToken: null,
    provider: null,
    providerId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("유저 생성 함수 테스트", () => {
    test("입력받은 정보로 유저를 생성해야 한다", async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);
      (userRepository.findByNickname as jest.Mock).mockResolvedValue(null);
      (authUtils.hashPassword as jest.Mock).mockResolvedValue(
        "hashed_password"
      );
      (userRepository.save as jest.Mock).mockResolvedValue(mockUser);
      (authUtils.filterSensitiveUserData as jest.Mock).mockReturnValue({
        id: mockUser.id,
        email: mockUser.email,
        nickname: mockUser.nickname,
      });

      const result = await userService.createUser(
        "test@example.com",
        "test",
        "password123"
      );

      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        "test@example.com"
      );
      expect(userRepository.findByNickname).toHaveBeenCalledWith("test");
      expect(authUtils.hashPassword).toHaveBeenCalledWith("password123");
      expect(userRepository.save).toHaveBeenCalledWith({
        email: "test@example.com",
        nickname: "test",
        hashedPassword: "hashed_password",
      });
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        nickname: mockUser.nickname,
      });
    });

    test("이미 사용중인 이메일일 경우 에러를 반환해야 한다", async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        userService.createUser("test@example.com", "test", "password123")
      ).rejects.toThrow("이미 사용중인 이메일입니다.");
    });

    test("이미 사용중인 닉네임일 경우 에러를 반환해야 한다", async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);
      (userRepository.findByNickname as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        userService.createUser("test@example.com", "test", "password123")
      ).rejects.toThrow("이미 사용중인 닉네임입니다.");
    });
  });

  describe("유저 조회 함수 테스트", () => {
    test("입력받은 정보로 유저를 조회해야 한다", async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (authUtils.verifyPassword as jest.Mock).mockResolvedValue(true);
      (authUtils.filterSensitiveUserData as jest.Mock).mockReturnValue({
        id: mockUser.id,
        email: mockUser.email,
        nickname: mockUser.nickname,
      });

      const result = await userService.getUser(
        "test@example.com",
        "password123"
      );

      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        "test@example.com"
      );
      expect(authUtils.verifyPassword).toHaveBeenCalledWith(
        "password123",
        "hashed_password"
      );
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        nickname: mockUser.nickname,
      });
    });

    test("이메일이 존재하지 않는 경우 에러를 반환해야 한다", async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(
        userService.getUser("notfound@example.com", "password123")
      ).rejects.toThrow("존재하지 않는 이메일입니다.");
    });

    test("비밀번호가 일치하지 않는 경우 에러를 반환해야 한다", async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (authUtils.verifyPassword as jest.Mock).mockResolvedValue(false);

      await expect(
        userService.getUser("test@example.com", "wrongpassword")
      ).rejects.toThrow("비밀번호가 일치하지 않습니다.");
    });
  });
});
