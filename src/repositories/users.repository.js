const prisma = require("../config/prismaClient");

async function findById(id) {
  return await prisma.user.findUnique({
    where: { id },
  });
}

async function findByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

async function create(user) {
  const newUser = await prisma.user.create({
    data: {
      email: user.email,
      nickname: user.nickname,
      encryptedPassword: user.encryptedPassword,
    },
  });

  // sql 공부하자...
  await prisma.$executeRawUnsafe(`
  SELECT setval(pg_get_serial_sequence('"User"', 'id'), (
    SELECT MAX(id) FROM "User"
  ) + 1
);
`);

  return newUser;
}

async function update(id, data) {
  return await prisma.user.update({
    where: { id },
    data: data,
  });
}

async function remove(id) {
  return await prisma.user.delete({
    where: { id },
  });
}

const userRepository = {
  findById,
  findByEmail,
  create,
  update,
  remove,
};

module.exports = userRepository;
