type TArticle = {
  id: number;
  title: string;
  content: string;
  authorId: string;
}[];

type TArticleComment = {
  content: string;
  articleId: number;
  authorId: string;
}[];

type TArticleLike = {
  userId: string;
  articleId: number;
}[];

export const ARTICLE_MOCK: TArticle = [
  {
    id: 1,
    title: "시드 데이터 1",
    content: "시드 데이터 입니다.",
    authorId: "",
  },
  {
    id: 2,
    title: "시드 데이터 2",
    content: "시드 데이터 입니다.",
    authorId: "",
  },
  {
    id: 3,
    title: "시드 데이터 3",
    content: "시드 데이터 입니다.",
    authorId: "",
  },
  {
    id: 4,
    title: "시드 데이터 4",
    content: "시드 데이터 입니다.",
    authorId: "",
  },
  {
    id: 5,
    title: "시드 데이터 5",
    content: "시드 데이터 입니다.",
    authorId: "",
  },
];

export const ARTICLE_COMMENT_MOCK: TArticleComment = [
  {
    content: "댓글 시드 데이터 1",
    articleId: 1,
    authorId: "",
  },
  {
    content: "댓글 시드 데이터 2",
    articleId: 2,
    authorId: "",
  },
  {
    content: "댓글 시드 데이터 3",
    articleId: 3,
    authorId: "",
  },
  {
    content: "댓글 시드 데이터 4",
    articleId: 4,
    authorId: "",
  },
  {
    content: "댓글 시드 데이터 5",
    articleId: 5,
    authorId: "",
  },
];

export const ARTICLE_LIKE_MOCK: TArticleLike = [
  {
    userId: "",
    articleId: 1,
  },
  {
    userId: "",
    articleId: 2,
  },
  {
    userId: "",
    articleId: 3,
  },
  {
    userId: "",
    articleId: 4,
  },
  {
    userId: "",
    articleId: 5,
  },
];
