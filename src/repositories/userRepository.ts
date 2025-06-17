import { prisma } from "../db/prisma/client.prisma";
import {
  UserDto,
  UserParamsDto,
  UserSaveDto,
  UserUpdateDto,
} from "../dtos/user.dto";

async function findById(id: UserDto["id"]) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

async function findByEmail(email: UserDto["email"]) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}

async function save(user: UserSaveDto) {
  return prisma.user.create({
    data: {
      email: user.email,
      nickname: user.nickname,
      encryptedPassword: user.encryptedPassword,
    },
  });
}

async function update(id: UserParamsDto["id"], data: Partial<UserUpdateDto>) {
  return prisma.user.update({
    where: {
      id,
    },
    data: data,
  });
}

export default {
  findById,
  findByEmail,
  save,
  update,
};
