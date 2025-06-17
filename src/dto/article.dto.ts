import { z } from "zod";

export const IdParamSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
});

export const ArticleBodySchema = z
  .object({
    id: z.number(),
    authorId: z.string().regex(/^\d+$/).transform(Number),
    title: z.string().min(1, "제목은 필수입니다."),
    content: z.string().min(1, "내용은 필수입니다."),
    image: z.string().url().or(z.literal("")).optional(),
  })
  .transform((data) => ({
    ...data,
    image: data.image ?? "", // undefined -> "" 변환
  }));

export const ArticlePatchSchema = z
  .object({
    title: z.string().optional(),
    content: z.string().optional(),
    image: z.string().url().optional().or(z.literal("")),
  })
  .refine((data) => data.title || data.content || data.image, {
    message: "수정할 값이 최소 하나 이상 필요합니다.",
  });

export type ArticleBodyDTO = z.infer<typeof ArticleBodySchema>;
export type ArticlePatchDTO = z.infer<typeof ArticlePatchSchema>;
