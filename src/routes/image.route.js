// src/routes/image.route.js
const express = require("express");
const imageController = require("../controllers/image.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");

const router = express.Router();

/**
 * @swagger
 * /images/upload:
 * post:
 * summary: Upload an image
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * multipart/form-data:
 * schema:
 * type: object
 * properties:
 * image:
 * type: string
 * format: binary
 * responses:
 * 200:
 * description: Successful upload
 * 400:
 * description: Bad Request
 * 401:
 * description: Unauthorized
 */
router.post("/upload", authMiddleware, imageController.uploadImage);

module.exports = router;
