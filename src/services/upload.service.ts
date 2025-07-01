const uploadService = {
  generateImageUrl: (filename: string): string => {
    // S3 public URL 반환
    const bucket = process.env.AWS_S3_BUCKET;
    const region = process.env.AWS_REGION;
    return `https://${bucket}.s3.${region}.amazonaws.com/images/${filename}`;
  },
};

export default uploadService; 