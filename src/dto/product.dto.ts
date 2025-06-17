import { z } from "zod";

export const ProductBodySchema = z.object({
  name: z.string().min(1, "상품 이름은 필수입니다."),
  description: z.string().min(1, "상품 설명은 필수입니다."),
  price: z.number().min(0, "가격은 0 이상이어야 합니다."),
  tags: z.array(z.string()).optional(), // 문자열 배열로 받되, optional
  imageUrl: z.string().url().optional(), // multer에서 직접 주입됨
  authorId: z.number().optional(), // 토큰에서 파싱
});

export type ProductBodyDTO = z.infer<typeof ProductBodySchema>;

// // 상품 수정용 스키마
// export const ProductUpdateSchema = ProductBodySchema.partial();
// export type ProductUpdateDTO = z.infer<typeof ProductUpdateSchema>;

// // 상품 댓글용 스키마
// export const ProductCommentBodySchema = z.object({
//   content: z.string().min(1, "댓글 내용은 필수입니다."),
// });
// export type ProductCommentBodyDTO = z.infer<typeof ProductCommentBodySchema>;
