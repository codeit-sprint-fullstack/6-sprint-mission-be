import {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

/**
 * S3 URL에서 key를 추출
 */
export function extractS3Key(s3Url: string): string | null {
  try {
    const url = new URL(s3Url);
    // S3 URL 형식: https://bucket-name.s3.region.amazonaws.com/key
    return url.pathname.substring(1); // 맨 앞의 '/' 제거
  } catch {
    return null;
  }
}

/**
 * 이미지가 private 폴더에 저장되었는지 확인
 */
export function isPrivateImage(imageUrl: string): boolean {
  const key = extractS3Key(imageUrl);
  return key ? key.startsWith("private/") : false;
}

/**
 * Private 이미지에 대한 presigned URL 생성
 */
export async function generatePresignedUrl(
  s3Key: string,
  expiresIn: number = 300 // 기본 5분
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: s3Key,
  });

  return await getSignedUrl(s3, command, { expiresIn });
}

/**
 * 이미지 URL 처리 - private이면 presigned URL 생성
 */
export async function processImageUrl(imageUrl: string): Promise<string> {
  // Private 이미지 확인
  if (isPrivateImage(imageUrl)) {
    const key = extractS3Key(imageUrl);
    if (key) {
      try {
        return await generatePresignedUrl(key, 300); // 5분 유효
      } catch (error) {
        console.error("Presigned URL 생성 실패:", error);
        return imageUrl; // 실패 시 원본 URL 반환
      }
    }
  }

  // Public 이미지이거나 presigned URL 생성 실패 시 원본 URL 반환
  return imageUrl;
}

/**
 * 이미지 배열 처리
 */
export async function processImageUrls(imageUrls: string[]): Promise<string[]> {
  const processedUrls = await Promise.all(
    imageUrls.map((url) => processImageUrl(url))
  );

  return processedUrls;
}

/**
 * S3에서 이미지 삭제
 */
export async function deleteS3Image(imageUrl: string): Promise<boolean> {
  try {
    const key = extractS3Key(imageUrl);
    if (!key) {
      console.error("유효하지 않은 S3 URL:", imageUrl);
      return false;
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    });

    await s3.send(command);
    console.log(`S3 이미지 삭제 성공: ${key}`);
    return true;
  } catch (error) {
    console.error("S3 이미지 삭제 실패:", error);
    return false;
  }
}

/**
 * 여러 S3 이미지 삭제 (병렬 처리)
 */
export async function deleteS3Images(imageUrls: string[]): Promise<void> {
  if (imageUrls.length === 0) return;

  try {
    await Promise.all(imageUrls.map((url) => deleteS3Image(url)));
    console.log(`${imageUrls.length}개 이미지 삭제 완료`);
  } catch (error) {
    console.error("일부 이미지 삭제 실패:", error);
  }
}

/**
 * 기존 이미지와 새 이미지 비교하여 삭제할 이미지 찾기
 */
export function findImagesToDelete(
  oldImages: string[],
  newImages: string[]
): string[] {
  return oldImages.filter((oldImg) => !newImages.includes(oldImg));
}
