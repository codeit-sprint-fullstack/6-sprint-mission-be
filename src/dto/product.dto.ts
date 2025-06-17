import { z } from "zod";

export const ProductBodySchema = z.object({
  name: z.string().min(1, "상품 이름은 필수입니다."),
  description: z.string().min(1, "상품 설명은 필수입니다."),
  price: z.number().min(0, "가격은 0 이상이어야 합니다."),
  tags: z.array(z.string()),
  imageUrl: z.string().url(),
  authorId: z.number(),
});

export type ProductBodyDTO = z.infer<typeof ProductBodySchema>;

export const ProductUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.number().min(0).optional(),
});

export const ProductQuerySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  pageSize: z.coerce.number().min(1).optional().default(10),
  orderBy: z.enum(["recent", "favorite"]).optional().default("recent"),
  keyword: z.string().optional().default(""),
});
