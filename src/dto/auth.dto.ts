import { z } from "zod";

export const SignUpBodySchema = z.object({
  email: z.string().email("유효한 이메일 형식이 아닙니다."),
  nickname: z.string().min(1, "닉네임은 필수입니다."),
  encryptedPassword: z.string().min(4, "비밀번호는 4자 이상이어야합니다."),
});

export const SignInBodySchema = z.object({
  email: z.string().email("유효한 이메일 형식이 아닙니다."),
  encryptedPassword: z.string().min(4, "비밀번호는 4자 이상이어야합니다."),
});

export const CreateUserSchema = z.object({
  email: z.string().email(),
  nickname: z.string().min(2),
  encryptedPassword: z.string().min(1),
});

export const EmailSchema = z.string().email();

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
