import "dotenv/config";

const config = {
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
  jwtExpiration: process.env.JWT_EXPIRATION || "1h",
};

export default config;
