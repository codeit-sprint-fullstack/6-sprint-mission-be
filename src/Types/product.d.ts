import { Product } from '@prisma/client';

export interface ProductCreateRequest {
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
}

export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {}

export interface ProductQueryParams {
  page?: string;
  pageSize?: string;
  orderBy?: string;
  keyword?: string;
} 

