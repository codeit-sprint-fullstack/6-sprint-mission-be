import { User } from "@prisma/client";
import prisma from "../config/client.prisma";
import bcrypt from "bcrypt";

async function save(
  user: Pick<User, "email" | "nickname" | "encryptedPassword">
) {
  const hashedPassword = await bcrypt.hash(user.encryptedPassword, 10);
  return await prisma.user.create({
    data: {
      email: user.email,
      nickname: user.nickname,
      encryptedPassword: hashedPassword,
    },
  });
}

async function findByEmail(user: User["email"]): Promise<User | null> {
  const getUser = await prisma.user.findUnique({
    where: { email: user }, //이메일을 통해 유저 찾기
  });

  // if (!getUser || !encryptedPassword || !getUser.encryptedPassword) {
  //   throw new Error("이메일 또는 비밀번호가 일치하지 않습니다.");
  // }

  // const isMatched = await bcrypt.compare(
  //   encryptedPassword,
  //   getUser.encryptedPassword
  // );
  // if (!isMatched) throw new Error("비밀번호가 일치하지 않습니다.");

  return getUser;
}

export default {
  save,
  findByEmail,
};
