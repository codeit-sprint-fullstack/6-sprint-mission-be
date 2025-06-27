export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  tags?: string[];
  image?: string | null;
  userId: number;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
}

export interface ProductResponseDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
  image: string | null;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  ownerNickname: string;
  favoritesCount: number;
  isFavorite: boolean;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
}