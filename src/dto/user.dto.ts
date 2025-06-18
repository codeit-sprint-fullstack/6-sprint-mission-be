import { z } from "zod";

export const UserResponseSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  nickname: z.string(),
});

export const UserWithTokenSchema = z.object({
  accessToken: z.string(),
  user: UserResponseSchema,
});

export type UserResponseDTO = z.infer<typeof UserResponseSchema>;
export type UserWithTokenDTO = z.infer<typeof UserWithTokenSchema>;
