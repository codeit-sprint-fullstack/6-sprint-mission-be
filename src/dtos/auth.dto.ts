import { z } from "zod";

export const SignUpSchema = z.object({
  email: z.string().email("유효한 이메일 형식이어야 합니다."),
  nickname: z.string().min(2, "닉네임은 최소 2자 이상이어야 합니다."),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
  image: z.string().url().optional(),
});

export const SignInSchema = z.object({
  email: z.string().email("유효한 이메일 형식이어야 합니다."),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
});

export type SignUpDTO = z.infer<typeof SignUpSchema>;
export type SignInDTO = z.infer<typeof SignInSchema>;