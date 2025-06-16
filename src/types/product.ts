import { Prisma } from "@prisma/client";

export type TProductUser = {
    userId: number;
}

export type TProduct = {
    productId: number;
    content: string;
    name: string; 
    description: string; 
    price: number; 
    tags?: string[] | undefined; 
    images : string[] | Prisma.ProductCreateimagesInput | undefined;
}