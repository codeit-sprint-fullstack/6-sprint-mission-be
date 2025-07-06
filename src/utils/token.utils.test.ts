import jwt from "jsonwebtoken";
import userRepository from "../repositories/user.repository";
import { createToken, refreshAccessToken } from "./token.utils";
import { UnauthorizedError } from "../types/exceptions";
import { ExceptionMessage } from "../constants/ExceptionMessage";

describe("토큰 생성 함수 테스트", () => {
  const userId = "user1";

  test("유효한 액세슨 토큰을 생성한다", () => {
    const token = createToken(userId, "access");
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;

    expect(typeof token).toBe("string");
    expect(decoded).toHaveProperty("userId", userId);
    expect(decoded.exp).toBeGreaterThan(Date.now() / 1000);
  });

  test("유효한 리프레시 토큰을 생성한다", () => {
    const token = createToken(userId, "refresh");
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;

    expect(typeof token).toBe("string");
    expect(decoded).toHaveProperty("userId", userId);
    expect(decoded.exp).toBeGreaterThan(Date.now() / 1000);
  });

  test("기본 타입으로 액세스 토큰을 생성한다", () => {
    const token = createToken(userId);
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;

    expect(decoded).toHaveProperty("userId", userId);
  });

  test("시크릿 키가 없을 때 에러를 반환한다", () => {
    const jwtSecret = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;

    expect(() => createToken(userId)).toThrow();

    process.env.JWT_SECRET = jwtSecret;
  });
});

jest.mock("../repositories/user.repository");

describe("토큰 갱신 함수 테스트", () => {
  const mockUserId = "user1";
  const mockRefreshToken = "valid_refresh_token";

  const mockedFindById = userRepository.findById as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.skip("리프레시 토큰이 유효할 경우 새로운 액세스 토큰과 리프레시 토큰을 생성한다", async () => {
    mockedFindById.mockResolvedValue({
      id: mockUserId,
      refreshToken: mockRefreshToken,
    });

    const createTokenSpy = jest.spyOn(require("./token.utils"), "createToken");

    const { newAccessToken, newRefreshToken } = await refreshAccessToken(
      mockUserId,
      mockRefreshToken
    );

    expect(mockedFindById).toHaveBeenCalledWith(mockUserId);
    expect(createTokenSpy).toHaveBeenCalledWith(mockUserId);
    expect(createTokenSpy).toHaveBeenCalledWith(mockUserId, "refresh");
    expect(typeof newAccessToken).toBe("string");
    expect(typeof newRefreshToken).toBe("string");
  });

  test("유저 ID 값이 없을 때 UnauthroizedError를 반환한다", async () => {
    mockedFindById.mockResolvedValue(null);

    await expect(
      refreshAccessToken(mockUserId, mockRefreshToken)
    ).rejects.toThrow(UnauthorizedError);

    await expect(
      refreshAccessToken(mockUserId, mockRefreshToken)
    ).rejects.toThrow(ExceptionMessage.UNAUTHORIZED);
  });

  test("DB의 리프레시 토큰과 일치하지 않으면 UnauthorizedError를 반환한다", async () => {
    mockedFindById.mockResolvedValue({
      id: mockUserId,
      refreshToken: "different_refresh_token",
    });

    await expect(
      refreshAccessToken(mockUserId, mockRefreshToken)
    ).rejects.toThrow(UnauthorizedError);
  });
});
