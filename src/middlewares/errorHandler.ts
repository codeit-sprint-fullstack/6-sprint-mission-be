import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.message === "User not found") {
    res.status(404).json({ message: err.message });
    return;
  }

  if (err.message === "Invalid password") {
    res.status(401).json({ message: err.message });
    return;
  }

  if (
    err.message === "Email already exists" ||
    err.message === "Nickname already exists"
  ) {
    res.status(409).json({ message: err.message });
    return;
  }

  if (err.message === "Unauthorized") {
    res.status(403).json({ message: err.message });
    return;
  }

  if (err.message === "Product not found") {
    res.status(404).json({ message: err.message });
    return;
  }

  if (err.message === "Invalid refresh token") {
    res.status(401).json({ message: err.message });
    return;
  }

  res.status(500).json({ message: "Internal server error" });
};
