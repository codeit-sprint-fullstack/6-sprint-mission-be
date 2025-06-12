import { createHash, randomBytes } from "crypto";

const generateJwtSecret = () => {
  return randomBytes(32).toString("hex");
};

const jwtSecret = generateJwtSecret();
console.log("Your JWT Secret Key:", jwtSecret);
