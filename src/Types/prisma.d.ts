import { User, Product } from '@prisma/client';

export type UserWithRelations = User & {
  products: Product[];
};

export type ProductWithRelations = Product & {
  user: User;
}; 
