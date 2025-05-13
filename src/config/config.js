// src/config/config.js (예시)
require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
  jwtExpiration: process.env.JWT_EXPIRATION || "1h",
};
