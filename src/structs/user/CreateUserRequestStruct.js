import { object, string, optional } from "superstruct";

export const CreateUserRequestStruct = object({
  email: string(),
  nickname: string(),
  password: string(), // Assuming you'll receive a plain password for creation
  image: optional(string()), // Image is optional during creation
});
