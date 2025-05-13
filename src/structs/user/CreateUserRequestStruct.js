import { object, string, optional } from "superstruct";

export const CreateUserRequestStruct = object({
  email: string(),
  nickname: string(),
  password: string(), 
  image: optional(string()), // Image is optional during creation
});
