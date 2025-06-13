import { User } from "@prisma/client";
import prisma from "../config/client.prisma.js";

async function findById(id: User["id"]) {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) throw new Error("존재하지 않는 유저입니다.");
  return user;
}

export default {
  findById,
};
