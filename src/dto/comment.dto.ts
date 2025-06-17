import { z } from "zod";

export const CommentBodySchema = z.object({
  content: z.string().min(1, "댓글 내용은 필수입니다."),
});

export type CommentBodyDTO = z.infer<typeof CommentBodySchema>;
