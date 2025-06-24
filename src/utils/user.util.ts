import { User } from "@prisma/client";

// 비밀번호 제외
export function filterPassword(user: User) {
  const { password, ...data } = user;

  return data;
}
