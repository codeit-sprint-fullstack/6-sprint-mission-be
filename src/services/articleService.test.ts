import { Article, User } from "@prisma/client";
import articleRepository from "../repositories/articleRepository";
import { ArticleBodyDTO, ArticlePatchDTO } from "../dto/article.dto";
import { CommentBodyDTO } from "../dto/comment.dto";
import articleService from "./articleService";

jest.mock("../repositories/articleRepository");
const mockArticleRepo = articleRepository as jest.Mocked<
  typeof articleRepository
>;

// async function create(article: ArticleBodyDTO) {
//   return articleRepository.save(article);
// }

test("create, article 인자를 articleRepository에 전달하여 article 데이터를 생성한다.", async () => {
  const article: ArticleBodyDTO = {
    image: "http://test.com",
    id: 1,
    authorId: 11,
    title: "create article. test with Jest",
    content: "create article. test with Jest",
  };

  const mockSavedArticle = {
    //new Date 때문에 값 고정
    ...article,
    createdAt: new Date("2023-01-01T00:00:00.000Z"),
    updatedAt: new Date("2023-01-01T00:00:00.000Z"),
  };

  mockArticleRepo.save.mockResolvedValue(mockSavedArticle);

  const result = await articleService.create(article);

  expect(mockArticleRepo.save).toHaveBeenCalledWith(article);
  expect(result).toEqual(mockSavedArticle);
});

// async function getById(articleId: Article["id"], userId: User["id"]) {
//   return articleRepository.getById(articleId, userId);
// }

test("getById, articleId와 userId를 articleRepository에 전달하여 article 데이터를 조회한다.", async () => {
  const articleId = 1;
  const userId = 11;

  const article: ArticleBodyDTO = {
    image: "http://test.com",
    id: articleId,
    authorId: userId,
    title: "create article. test with Jest",
    content: "create article. test with Jest",
  };

  const mockGetArticle = {
    //new Date 때문에 값 고정
    ...article,
    createdAt: new Date("2023-01-01T00:00:00.000Z"),
    updatedAt: new Date("2023-01-01T00:00:00.000Z"),
    isLiked: false,
    favorites: [],
  };

  mockArticleRepo.getById.mockResolvedValue(mockGetArticle);

  const result = await articleService.getById(articleId, userId);

  expect(mockArticleRepo.getById).toHaveBeenCalledWith(articleId, userId);
  expect(mockArticleRepo.getById).toHaveBeenCalledTimes(1);
  expect(result).toStrictEqual(mockGetArticle);
});

// async function getAll() {
//   return articleRepository.getAll();
// }

test("getAll, articleRepository에서 모든 article 데이터를 조회한다.", async () => {
  const mockArticles = [
    {
      id: 1,
      authorId: 11,
      title: "First Article",
      content: "First content",
      image: "http://example.com/1.jpg",
      createdAt: new Date("2023-01-01T00:00:00.000Z"),
      updatedAt: new Date("2023-01-01T00:00:00.000Z"),
      isLiked: false,
      favorites: [],
    },
    {
      id: 2,
      authorId: 12,
      title: "Second Article",
      content: "Second content",
      image: "http://example.com/2.jpg",
      createdAt: new Date("2023-01-02T00:00:00.000Z"),
      updatedAt: new Date("2023-01-02T00:00:00.000Z"),
      isLiked: true,
      favorites: [12],
    },
  ];

  mockArticleRepo.getAll.mockResolvedValue(mockArticles);

  const result = await articleService.getAll();

  expect(mockArticleRepo.getAll).toHaveBeenCalledTimes(1);
  expect(result).toStrictEqual(mockArticles);
});

// async function update(id: Article["id"], review: ArticlePatchDTO) {
//   return articleRepository.update(id, review);
// }

test("update, articleId와 review를 articleRepository에 전달하여 갱신된 article 데이터를 조회한다.", async () => {
  const articleId = 1;
  const review: ArticlePatchDTO = { title: "update article. test with jest" };
  const userId = 11;

  const article: ArticleBodyDTO = {
    image: "http://test.com",
    id: articleId,
    authorId: userId,
    title: "create article. test with Jest",
    content: "create article. test with Jest",
    ...review,
  };

  const mockPatchArticle = {
    //new Date 때문에 값 고정
    ...article,
    createdAt: new Date("2023-01-01T00:00:00.000Z"),
    updatedAt: new Date("2023-01-01T00:00:00.000Z"),
    isLiked: false,
    favorites: [],
  };

  mockArticleRepo.update.mockResolvedValue(mockPatchArticle);

  const result = await articleService.update(articleId, review);

  expect(mockArticleRepo.update).toHaveBeenCalledWith(articleId, review);
  expect(mockArticleRepo.update).toHaveBeenCalledTimes(1);
  expect(result).toStrictEqual(mockPatchArticle);
});

// async function deleteById(id: Article["id"]) {
//   return articleRepository.deleteById(id);
// }

test("delete, articleId를 articleRepository에 전달하여 삭제한다.", async () => {
  const articleId = 1;
  const userId = 11;

  const mockDeletedArticle = {
    //new Date 때문에 값 고정
    image: "http://test.com",
    id: articleId,
    authorId: userId,
    title: "create article. test with Jest",
    content: "create article. test with Jest",
    createdAt: new Date("2023-01-01T00:00:00.000Z"),
    updatedAt: new Date("2023-01-01T00:00:00.000Z"),
    isLiked: false,
    favorites: [],
  };

  mockArticleRepo.deleteById.mockResolvedValue(mockDeletedArticle);

  const result = await articleService.deleteById(articleId);

  expect(mockArticleRepo.deleteById).toHaveBeenCalledWith(articleId);
  expect(mockArticleRepo.deleteById).toHaveBeenCalledTimes(1);
  expect(result).toStrictEqual(mockDeletedArticle);
});

// async function createArticleComment(
//   comment: CommentBodyDTO & { articleId: number; authorId: number }
// ) {
//   return articleRepository.saveArticleComment(comment);
// }

test("createArticleComment, comment를 articleRepository에 전달하여 댓글을 생성한다.", async () => {
  const comment = {
    articleId: 1,
    authorId: 11,
    content: "this is a test comment",
  };

  const mockSavedComment = {
    //new Date 때문에 값 고정
    id: 101,
    createdAt: new Date("2023-01-01T00:00:00.000Z"),
    updatedAt: new Date("2023-01-01T00:00:00.000Z"),
    content: comment.content,
    articleId: comment.articleId,
    authorId: comment.authorId,
    productId: 1,
  };

  mockArticleRepo.saveArticleComment.mockResolvedValue(mockSavedComment);

  const result = await articleService.createArticleComment(comment);

  expect(mockArticleRepo.saveArticleComment).toHaveBeenCalledWith(comment);
  expect(mockArticleRepo.saveArticleComment).toHaveBeenCalledTimes(1);
  expect(result).toStrictEqual(mockSavedComment);
});

// async function getAllArticleComment(id: Article["id"]) {
//   return articleRepository.getAllArticleComment(id);
// }

test("getAllArticleComment, articleId를 articleRepository에 전달하여 모든 댓글을 조회한다.", async () => {
  const articleId = 1;

  const mockComments = [
    {
      id: 101,
      articleId,
      authorId: 11,
      productId: 1,
      content: "this is a test comment",
      createdAt: new Date("2023-01-01T00:00:00.000Z"),
      updatedAt: new Date("2023-01-01T00:00:00.000Z"),
    },
    {
      id: 102,
      articleId,
      authorId: 12,
      productId: 1,
      content: "Second comment",
      createdAt: new Date("2023-01-02T00:00:00.000Z"),
      updatedAt: new Date("2023-01-02T00:00:00.000Z"),
    },
  ];

  mockArticleRepo.getAllArticleComment.mockResolvedValue(mockComments);

  const result = await articleService.getAllArticleComment(articleId);

  expect(mockArticleRepo.getAllArticleComment).toHaveBeenCalledWith(articleId);
  expect(mockArticleRepo.getAllArticleComment).toHaveBeenCalledTimes(1);
  expect(result).toStrictEqual(mockComments);
});

// export default {
//   create,
//   getById,
//   getAll,
//   update,
//   deleteById,
//   createArticleComment,
//   getAllArticleComment,
// };
