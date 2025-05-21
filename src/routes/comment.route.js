// src/routes/comment.route.js
const express = require("express");
const commentController = require("../controllers/comment.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");

const router = express.Router();

/**
 * @swagger
 * /products/{productId}/comments:
 * post:
 * summary: Create a new comment on a product
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: productId
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
 * content:
 * type: string
 * responses:
 * 201:
 * description: Successful creation
 * 400:
 * description: Bad Request
 * 401:
 * description: Unauthorized
 * 404:
 * description: Product not found
 */
router.post(
  "/products/:productId/comments",
  authMiddleware,
  commentController.createProductComment
);

/**
 * @swagger
 * /products/{productId}/comments:
 * get:
 * summary: Get comments for a product
 * parameters:
 * - in: path
 * name: productId
 * required: true
 * schema:
 * type: integer
 * responses:
 * 200:
 * description: Successful response
 * 404:
 * description: Product not found
 */
router.get(
  "/products/:productId/comments",
  commentController.getProductComments
);

/**
 * @swagger
 * /articles/{articleId}/comments:
 * post:
 * summary: Create a new comment on an article
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
 * content:
 * type: string
 * responses:
 * 201:
 * description: Successful creation
 * 400:
 * description: Bad Request
 * 401:
 * description: Unauthorized
 * 404:
 * description: Article not found
 */
router.post(
  "/articles/:articleId/comments",
  authMiddleware,
  commentController.createArticleComment
);

/**
 * @swagger
 * /articles/{articleId}/comments:
 * get:
 * summary: Get comments for an article
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
router.get(
  "/articles/:articleId/comments",
  commentController.getArticleComments
);

/**
 * @swagger
 * /comments/{commentId}:
 * patch:
 * summary: Update a comment by ID
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: commentId
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
 * content:
 * type: string
 * responses:
 * 200:
 * description: Successful response
 * 400:
 * description: Bad Request
 * 401:
 * description: Unauthorized
 * 404:
 * description: Comment not found
 */
router.patch(
  "/comments/:commentId",
  authMiddleware,
  commentController.updateComment
);

/**
 * @swagger
 * /comments/{commentId}:
 * delete:
 * summary: Delete a comment by ID
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: commentId
 * required: true
 * schema:
 * type: integer
 * responses:
 * 204:
 * description: Successful deletion
 * 401:
 * description: Unauthorized
 * 404:
 * description: Comment not found
 */
router.delete(
  "/comments/:commentId",
  authMiddleware,
  commentController.deleteComment
);

module.exports = router;
