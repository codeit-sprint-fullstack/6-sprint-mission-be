import express from "express";
import multer from "multer";
import auth from "../middlewares/auth.js";

const imageRouter = express.Router();

const uploads = multer({ dest: "uploads/" });
imageRouter.post(
  "/upload",
  auth.verifyAccessToken,
  uploads.single("image"),
  (req, res) => {
    const path = `${req.protocol}://${req.get("host")}/image/${
      req.file.filename
    }`;
    res.json({ url: path });
  }
);

export default imageRouter;
