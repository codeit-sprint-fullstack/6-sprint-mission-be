import { Request, Response, NextFunction } from "express";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

interface FileInfo {
  filename: string;
  contentType: string;
}

interface PresignedUrlResult {
  uploadUrl: string; // 클라이언트가 업로드할 때 사용할 URL
  fileUrl: string; // 업로드 완료 후 접근할 최종 URL
  key: string; // S3 객체 키
}

/**
 * Presigned URL 생성 미들웨어
 * 클라이언트가 S3에 직접 업로드할 수 있는 임시 URL을 생성합니다.
 */
const generatePresignedUrls = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files: FileInfo[] = req.body;

    // 요청 데이터 검증
    if (!Array.isArray(files) || files.length === 0) {
      res.status(400).json({
        error:
          "파일 정보가 필요합니다. { filename: string, contentType: string }[] 형식으로 전송해주세요.",
      });
      return;
    }

    // private/public 폴더 분기
    const isPrivate = req.query.access === "private";
    const folder = isPrivate ? "private/" : "public/";

    const results = await Promise.all(
      files.map(async ({ filename, contentType }) => {
        // 파일명 검증
        if (!filename || !contentType) {
          throw new Error("filename과 contentType은 필수입니다.");
        }

        // 이미지 파일만 허용 (기존 upload 미들웨어와 동일한 정책)
        if (!contentType.startsWith("image/")) {
          throw new Error("이미지 파일만 업로드 가능합니다.");
        }

        // S3 키 생성 (타임스탬프 + 원본 파일명)
        const key = `${folder}${Date.now()}_${filename}`;

        // 업로드용 Presigned URL 생성
        const command = new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: key,
          ContentType: contentType,
        });

        const uploadUrl = await getSignedUrl(s3, command, {
          expiresIn: 300, // 5분 유효
        });

        // 업로드 완료 후 접근할 최종 URL
        const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.ap-northeast-2.amazonaws.com/${key}`;

        return {
          uploadUrl,
          fileUrl,
          key,
        };
      })
    );

    res.json(results);
  } catch (error) {
    console.error("Presigned URL 생성 실패:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Presigned URL 생성 중 오류가 발생했습니다.";
    res.status(500).json({
      error: errorMessage,
    });
  }
};

export { generatePresignedUrls };
export default generatePresignedUrls;
