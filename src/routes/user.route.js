// src/routes/user.route.js
const express = require("express");
const userController = require("../controllers/user.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js"); // 필요에 따라

const router = express.Router();

/**
 * @swagger
 * /users/me:
 * get:
 * summary: Get current user's information
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Successful response
 * 401:
 * description: Unauthorized
 */
router.get("/me", authMiddleware, userController.getMe);

/**
 * @swagger
 * /users/me:
 * patch:
 * summary: Update current user's information
 * security:
 * - bearerAuth: []
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
 */
router.patch("/me", authMiddleware, userController.updateMe);

/**
 * @swagger
 * /users/me/password:
 * patch:
 * summary: Update current user's password
 * security:
 * - bearerAuth: []
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
 */
router.patch("/me/password", authMiddleware, userController.updatePassword);

/**
 * @swagger
 * /users/me/products:
 * get:
 * summary: Get current user's products
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Successful response
 * 401:
 * description: Unauthorized
 */
router.get("/me/products", authMiddleware, userController.getMyProducts);

/**
 * @swagger
 * /users/me/favorites:
 * get:
 * summary: Get current user's favorite products
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Successful response
 * 401:
 * description: Unauthorized
 */
router.get("/me/favorites", authMiddleware, userController.getMyFavorites);

module.exports = router;
