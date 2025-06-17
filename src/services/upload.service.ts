const uploadService = {
  generateImageUrl: (filename: string): string => {
    return `/uploads/${filename}`; // 클라이언트에서 접근 가능한 이미지 URL 생성
  },
};

export default uploadService; 