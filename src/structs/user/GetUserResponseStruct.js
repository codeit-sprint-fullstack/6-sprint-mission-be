import { object, string, number, optional, date } from "superstruct";

export const GetUserResponseStruct = object({
  id: number(),
  email: string(),
  nickname: string(),
  image: optional(string()),
  createdAt: date(),
  updatedAt: date(),
});
