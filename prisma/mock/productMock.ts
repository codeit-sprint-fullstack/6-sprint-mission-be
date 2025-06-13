type TProduct = {
  name: string;
  description: string;
  price: number;
  authorId: string;
}[];

type TProductComment = {
  content: string;
  productId: number;
  authorId: string;
}[];

type TProductLike = {
  userId: string;
  productId: number;
}[];

export const PRODUCT_MOCK: TProduct = [
  {
    name: "상품 시드 데이터 1",
    description: "상품 설명 시드 데이터 1",
    price: 10000,
    authorId: "임시",
  },
  {
    name: "상품 시드 데이터 2",
    description: "상품 설명 시드 데이터 2",
    price: 20000,
    authorId: "임시",
  },
  {
    name: "상품 시드 데이터 3",
    description: "상품 설명 시드 데이터 3",
    price: 30000,
    authorId: "임시",
  },
  {
    name: "상품 시드 데이터 4",
    description: "상품 설명 시드 데이터 4",
    price: 40000,
    authorId: "임시",
  },
  {
    name: "상품 시드 데이터 5",
    description: "상품 설명 시드 데이터 5",
    price: 50000,
    authorId: "임시",
  },
];

export const PRODUCT_COMMENT_MOCK: TProductComment = [
  {
    content: "상품 댓글 시드 데이터 1",
    productId: 1,
    authorId: "임시",
  },
  {
    content: "상품 댓글 시드 데이터 2",
    productId: 2,
    authorId: "임시",
  },
  {
    content: "상품 댓글 시드 데이터 3",
    productId: 3,
    authorId: "임시",
  },
  {
    content: "상품 댓글 시드 데이터 4",
    productId: 4,
    authorId: "임시",
  },
  {
    content: "상품 댓글 시드 데이터 5",
    productId: 5,
    authorId: "임시",
  },
];

export const PRODUCT_LIKE_MOCK: TProductLike = [
  {
    userId: "1",
    productId: 1,
  },
  {
    userId: "2",
    productId: 2,
  },
  {
    userId: "3",
    productId: 3,
  },
  {
    userId: "4",
    productId: 4,
  },
  {
    userId: "5",
    productId: 5,
  },
];
