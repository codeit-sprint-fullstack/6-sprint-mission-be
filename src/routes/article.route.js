// src/routes/article.route.js
const express = require("express");
const articleController = require("../controllers/article.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");

const router = express.Router();

/**
 * @swagger
 * /articles:
 * post:
 * summary: Create a new article
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * title:
 * type: string
 * content:
 * type: string
 * writer:
 * type: string
 * responses:
 * 201:
 * description: Successful creation
 * 400:
 * description: Bad Request
 * 401:
 * description: Unauthorized
 */
router.post("/", authMiddleware, articleController.createArticle);

/**
 * @swagger
 * /articles:
 * get:
 * summary: Get all articles
 * responses:
 * 200:
 * description: Successful response
 */
router.get("/", articleController.getAllArticles);

/**
 * @swagger
 * /articles/{articleId}:
 * get:
 * summary: Get an article by ID
 * parameters:
 * - in: path
 * name: articleId
 * required: true
 * schema:
 * type: integer
 * responses:
 * 200:
 * description: Successful response
 * 404:
 * description: Article not found
 */
router.get("/:articleId", articleController.getArticleById);

/**
 * @swagger
 * /articles/{articleId}:
 * patch:
 * summary: Update an article by ID
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: articleId
 * required: true
 * schema:
 * type: integer
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * title:
 * type: string
 * content:
 * type: string
 * writer:
 * type: string
 * responses:
 * 200:
 * description: Successful response
 * 400:
 * description: Bad Request
 * 401:
 * description: Unauthorized
 * 404:
 * description: Article not found
 */
router.patch("/:articleId", authMiddleware, articleController.updateArticle);

/**
 * @swagger
 * /articles/{articleId}:
 * delete:
 * summary: Delete an article by ID
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: articleId
 * required: true
 * schema:
 * type: integer
 * responses:
 * 204:
 * description: Successful deletion
 * 401:
 * description: Unauthorized
 * 404:
 * description: Article not found
 */
router.delete("/:articleId", authMiddleware, articleController.deleteArticle);

/**
 * @swagger
 * /articles/{articleId}/like:
 * post:
 * summary: Like an article
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: articleId
 * required: true
 * schema:
 * type: integer
 * responses:
 * 200:
 * description: Article liked
 * 401:
 * description: Unauthorized
 * 404:
 * description: Article not found
 */
router.post("/:articleId/like", authMiddleware, articleController.likeArticle);

/**
 * @swagger
 * /articles/{articleId}/like:
 * delete:
 * summary: Unlike an article
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: articleId
 * required: true
 * schema:
 * type: integer
 * responses:
 * 204:
 * description: Article unliked
 * 401:
 * description: Unauthorized
 * 404:
 * description: Article not found
 */
router.delete(
  "/:articleId/like",
  authMiddleware,
  articleController.unlikeArticle
);

module.exports = router;
