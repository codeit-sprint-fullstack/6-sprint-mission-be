type TProduct = {
  id: number;
  name: string;
  description: string;
  price: number;
  authorId: string;
}[];

type TTag = {
  id: number;
  name: string;
}[];

type TProductTag = {
  productId: number;
  tagId: number;
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

type TProductImage = {
  imageUrl: string;
  userId: string;
  productId: number;
}[];

export const PRODUCT_MOCK: TProduct = [
  {
    id: 1,
    name: "상품 시드 데이터 1",
    description: "상품 설명 시드 데이터 1",
    price: 10000,
    authorId: "",
  },
  {
    id: 2,
    name: "상품 시드 데이터 2",
    description: "상품 설명 시드 데이터 2",
    price: 20000,
    authorId: "",
  },
  {
    id: 3,
    name: "상품 시드 데이터 3",
    description: "상품 설명 시드 데이터 3",
    price: 30000,
    authorId: "",
  },
  {
    id: 4,
    name: "상품 시드 데이터 4",
    description: "상품 설명 시드 데이터 4",
    price: 40000,
    authorId: "",
  },
  {
    id: 5,
    name: "상품 시드 데이터 5",
    description: "상품 설명 시드 데이터 5",
    price: 50000,
    authorId: "",
  },
];

export const TAG_MOCK: TTag = [
  {
    id: 1,
    name: "전자제품",
  },
  {
    id: 2,
    name: "노트북",
  },
  {
    id: 3,
    name: "휴대폰",
  },
  {
    id: 4,
    name: "태블릿",
  },
  {
    id: 5,
    name: "PC",
  },
];

export const PRODUCT_TAG_MOCK: TProductTag = [
  {
    productId: 1,
    tagId: 1,
  },
  {
    productId: 2,
    tagId: 2,
  },
  {
    productId: 3,
    tagId: 3,
  },
  {
    productId: 4,
    tagId: 4,
  },
  {
    productId: 5,
    tagId: 5,
  },
];

export const PRODUCT_COMMENT_MOCK: TProductComment = [
  {
    content: "상품 댓글 시드 데이터 1",
    productId: 1,
    authorId: "",
  },
  {
    content: "상품 댓글 시드 데이터 2",
    productId: 2,
    authorId: "",
  },
  {
    content: "상품 댓글 시드 데이터 3",
    productId: 3,
    authorId: "",
  },
  {
    content: "상품 댓글 시드 데이터 4",
    productId: 4,
    authorId: "",
  },
  {
    content: "상품 댓글 시드 데이터 5",
    productId: 5,
    authorId: "",
  },
];

export const PRODUCT_LIKE_MOCK: TProductLike = [
  {
    userId: "",
    productId: 1,
  },
  {
    userId: "",
    productId: 2,
  },
  {
    userId: "",
    productId: 3,
  },
  {
    userId: "",
    productId: 4,
  },
  {
    userId: "",
    productId: 5,
  },
];

export const PRODUCT_IMAGE_MOCK: TProductImage = [
  {
    imageUrl: "example1.com",
    userId: "",
    productId: 1,
  },
  {
    imageUrl: "example2.com",
    userId: "",
    productId: 2,
  },
  {
    imageUrl: "example3.com",
    userId: "",
    productId: 3,
  },
  {
    imageUrl: "example4.com",
    userId: "",
    productId: 4,
  },
  {
    imageUrl: "example5.com",
    userId: "",
    productId: 5,
  },
];
