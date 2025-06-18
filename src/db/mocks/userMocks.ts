import bcrypt from "bcrypt";

type User = {
  email: string;
  nickname: string;
  encryptedPassword: string;
};

export const getUserMocks = async (): Promise<User[]> => {
  const hashedPassword = await bcrypt.hash("1111", 10);
  return [
    {
      email: "test1@test.com",
      nickname: "test1",
      encryptedPassword: hashedPassword,
    },
  ];
};
