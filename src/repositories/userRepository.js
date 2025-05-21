import prisma from "../db/prisma/client.js";

/**
 * ID로 사용자 조회
 */
async function findById(id) {
  return await prisma.user.findUnique({
    where: {
      id: parseInt(id, 10),
    },
  });
}

/**
 * 이메일로 사용자 조회
 */
async function findByEmail(email) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}

/**
 * 회원가입 (비밀번호는 bcrypt로 암호화된 상태여야 함)
 */
async function createdUser(user) {
  return await prisma.user.create({
    data: {
      email: user.email,
      name: user.name,
      password: user.password, // 암호화된 비밀번호
      profileImageUrl: user.profileImageUrl ?? null,
    },
  });
}

/**
 * 사용자 정보 업데이트
 */
async function updateUser(id, data) {
  return await prisma.user.update({
    where: {
      id: parseInt(id, 10),
    },
    data,
  });
}

export default {
  findById,
  findByEmail,
  createdUser,
  updateUser,
};
