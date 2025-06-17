import { Prisma } from "@prisma/client";
import { TLikeParam } from "./like";

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

export type TProductParam = {
    name: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    description: string;
    price: number;
    tags: string[];
    images: string[];
    ownerId: number;
    likes?: TLikeParam[];
}