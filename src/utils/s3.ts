import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> {
  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: fileName,
    Body: buffer,
    ContentType: mimeType,
    ACL: "public-read",
  }));

  return `https://${process.env.S3_BUCKET_NAME}.s3.ap-northeast-2.amazonaws.com/${fileName}`;
}
