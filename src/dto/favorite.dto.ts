import { z } from "zod";

export const FavoriteIdSchema = z.object({
  productId: z.number().int().positive(),
  userId: z.number().int().positive(),
});

export const FavoriteParamSchema = z.object({
  id: z.coerce.number().int().positive(), //강제로 숫자로 변환, 양의 정수인지 타입 체크
});

export const FavoriteResponseSchema = z.object({
  message: z.string(),
});

export const CheckLikedResponseSchema = z.object({
  isLiked: z.boolean(),
});

export type FavoriteIdDTO = z.infer<typeof FavoriteIdSchema>;
export type FavoriteParamDTO = z.infer<typeof FavoriteParamSchema>;
export type FavoriteResponseDTO = z.infer<typeof FavoriteResponseSchema>;
export type CheckLikedResponseDTO = z.infer<typeof CheckLikedResponseSchema>;
