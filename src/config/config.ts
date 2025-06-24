import "dotenv/config";

interface Config {
  port: number;
  jwtSecret: string;
  jwtExpiration: string;
}

const config: Config = {
  port: parseInt(process.env.PORT || '5050', 10),
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
  jwtExpiration: process.env.JWT_EXPIRATION || "1h",
};

export default config;