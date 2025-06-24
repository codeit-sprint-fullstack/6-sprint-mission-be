import { Prisma, PrismaClient, User } from "@prisma/client";
import prisma from "../config/client.prisma";
import { DefaultArgs } from "@prisma/client/runtime/library";

type TOptions = {
  tx?: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >;
};

const findById = async (id: User["id"]) => {
  return await prisma.user.findUnique({
    where: { id },
    select: { id: true, nickname: true, image: true },
  });
};

const findByEmail = async (email: User["email"]) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

const findByNickname = async (nickname: User["nickname"]) => {
  return await prisma.user.findUnique({
    where: { nickname },
  });
};

const createUser = async (
  body: Pick<User, "email" | "password" | "nickname">,
  options: TOptions = {}
) => {
  const { tx } = options;
  const client = tx || prisma;

  const { email, password, nickname } = body;

  return await client.user.create({
    data: { email, password, nickname },
  });
};

export default {
  findById,
  findByEmail,
  findByNickname,
  createUser,
};
