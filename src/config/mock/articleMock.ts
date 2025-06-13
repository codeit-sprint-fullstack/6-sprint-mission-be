type TArticle = {
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
    title: "시드 데이터 1",
    content: "시드 데이터 입니다.",
    authorId: "임시",
  },
  {
    title: "시드 데이터 2",
    content: "시드 데이터 입니다.",
    authorId: "임시",
  },
  {
    title: "시드 데이터 3",
    content: "시드 데이터 입니다.",
    authorId: "임시",
  },
  {
    title: "시드 데이터 4",
    content: "시드 데이터 입니다.",
    authorId: "임시",
  },
  {
    title: "시드 데이터 5",
    content: "시드 데이터 입니다.",
    authorId: "임시",
  },
];

export const ARTICLE_COMMENT_MOCK: TArticleComment = [
  {
    content: "댓글 시드 데이터 1",
    articleId: 1,
    authorId: "임시",
  },
  {
    content: "댓글 시드 데이터 2",
    articleId: 2,
    authorId: "임시",
  },
  {
    content: "댓글 시드 데이터 3",
    articleId: 3,
    authorId: "임시",
  },
  {
    content: "댓글 시드 데이터 4",
    articleId: 4,
    authorId: "임시",
  },
  {
    content: "댓글 시드 데이터 5",
    articleId: 5,
    authorId: "임시",
  },
];

export const ARTICLE_LIKE_MOCK: TArticleLike = [
  {
    userId: "임시",
    articleId: 1,
  },
  {
    userId: "임시",
    articleId: 2,
  },
  {
    userId: "임시",
    articleId: 3,
  },
  {
    userId: "임시",
    articleId: 4,
  },
  {
    userId: "임시",
    articleId: 5,
  },
];
