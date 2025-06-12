import { object, string } from "superstruct";

export const LoginRequestStruct = object({
  email: string(),
  password: string(),
});
