import express, { Request, Response } from "express";
import multer from "multer";
import { verifyAccessToken } from "../middlewares/verifyToken";

const imageRouter = express.Router();

const uploads = multer({ dest: "uploads/" });

imageRouter.post(
  "/upload",
  verifyAccessToken,
  uploads.single("image"),
  (req: Request, res: Response) => {
    const path = `${req.protocol}://${req.get("host")}/image/${
      req.file?.filename
    }`;
    res.json({ url: path });
  }
);

export default imageRouter;
