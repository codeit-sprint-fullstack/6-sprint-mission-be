import { User } from "@prisma/client";
import prisma from "../config/client.prisma.js";
import bcrypt from "bcrypt";

async function save(user: User) {
  const hashedPassword = await bcrypt.hash(user.encryptedPassword, 10);
  return await prisma.user.create({
    data: {
      email: user.email,
      nickname: user.nickname,
      image: user.image,
      encryptedPassword: hashedPassword,
    },
  });
}

async function findByEmail(user: User) {
  const { email, encryptedPassword } = user;

  const getUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!getUser) throw new Error("존재하지 않는 유저입니다.");

  if (!getUser || !encryptedPassword || !getUser.encryptedPassword) {
    throw new Error("이메일 또는 비밀번호가 일치하지 않습니다.");
  }

  const isMatched = await bcrypt.compare(
    encryptedPassword,
    getUser.encryptedPassword
  );
  if (!isMatched) throw new Error("비밀번호가 일치하지 않습니다.");

  return getUser;
}

export default {
  save,
  findByEmail,
};
