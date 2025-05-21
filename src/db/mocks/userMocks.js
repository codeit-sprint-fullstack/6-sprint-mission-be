import bcrypt from "bcrypt";

const hashedPassword = await bcrypt.hash("1111", 10);

export const UserMocks = [
  {
    email: "test1@test.com",
    nickname: "test1",
    encryptedPassword: hashedPassword,
  },
];
