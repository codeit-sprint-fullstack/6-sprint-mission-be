// src/routes/product.route.js
const express = require("express");
const productController = require("../controllers/product.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");

const router = express.Router();

/**
 * @swagger
 * /products:
 * post:
 * summary: Create a new product
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * responses:
 * 201:
 * description: Successful creation
 * 400:
 * description: Bad Request
 * 401:
 * description: Unauthorized
 */
router.post("/", authMiddleware, productController.createProduct);

/**
 * @swagger
 * /products:
 * get:
 * summary: Get all products
 * responses:
 * 200:
 * description: Successful response
 */
router.get("/", productController.getAllProducts);

/**
 * @swagger
 * /products/{productId}:
 * get:
 * summary: Get a product by ID
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
router.get("/:productId", productController.getProductById);

/**
 * @swagger
 * /products/{productId}:
 * patch:
 * summary: Update a product by ID
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
 * responses:
 * 200:
 * description: Successful response
 * 400:
 * description: Bad Request
 * 401:
 * description: Unauthorized
 * 404:
 * description: Product not found
 */
router.put("/:productId", authMiddleware, productController.updateProduct);

/**
 * @swagger
 * /products/{productId}:
 * delete:
 * summary: Delete a product by ID
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: productId
 * required: true
 * schema:
 * type: integer
 * responses:
 * 204:
 * description: Successful deletion
 * 401:
 * description: Unauthorized
 * 404:
 * description: Product not found
 */
router.delete(
  "/:productId",
  authMiddleware,
  productController.deleteProductById
);

/**
 * @swagger
 * /products/{productId}/favorite:
 * post:
 * summary: Add a product to favorites
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: productId
 * required: true
 * schema:
 * type: integer
 * responses:
 * 200:
 * description: Added to favorites
 * 401:
 * description: Unauthorized
 * 404:
 * description: Product not found
 */
router.post(
  "/:productId/favorite",
  authMiddleware,
  productController.addToFavorites
);

/**
 * @swagger
 * /products/{productId}/favorite:
 * delete:
 * summary: Remove a product from favorites
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: productId
 * required: true
 * schema:
 * type: integer
 * responses:
 * 204:
 * description: Removed from favorites
 * 401:
 * description: Unauthorized
 * 404:
 * description: Product not found
 */
router.delete(
  "/:productId/favorite",
  authMiddleware,
  productController.removeFromFavorites
);

module.exports = router;
