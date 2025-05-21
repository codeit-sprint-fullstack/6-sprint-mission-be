// src/routes/auth.route.js
const express = require("express");
const authController = require("../controllers/auth.controller.js");

const router = express.Router();

/**
 * @swagger
 * /auth/signUp:
 * post:
 * summary: Register a new user
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * nickname:
 * type: string
 * email:
 * type: string
 * format: email
 * password:
 * type: string
 * responses:
 * 201:
 * description: Successful registration
 * 400:
 * description: Bad Request
 */
router.post("/signUp", authController.signUp);

/**
 * @swagger
 * /auth/signIn:
 * post:
 * summary: Sign in with email and password
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * email:
 * type: string
 * format: email
 * password:
 * type: string
 * responses:
 * 200:
 * description: Successful sign in
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * token:
 * type: string
 */
router.post("/signIn", authController.signIn);

/**
 * @swagger
 * /auth/refresh-token:
 * post:
 * summary: Refresh authentication token
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * refreshToken:
 * type: string
 * responses:
 * 200:
 * description: Successful refresh
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * token:
 * type: string
 */
// router.post("/refresh-token", authController.refreshToken);

module.exports = router;
