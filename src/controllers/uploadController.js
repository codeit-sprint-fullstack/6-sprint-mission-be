import uploadService from '../services/uploadService.js';

const uploadController = {
  uploadSingleImage: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: '파일이 업로드되지 않았거나, 허용되지 않는 파일 형식입니다.' });
      }
      const imageUrl = await uploadService.generateImageUrl(req.file.filename);
      res.status(200).json({ imageUrl });
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      res.status(500).json({ message: '이미지 업로드에 실패했습니다.' });
    }
  },

  uploadMultipleImages: async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: '파일이 업로드되지 않았거나, 허용되지 않는 파일 형식입니다.' });
      }
      const imageUrls = await Promise.all(
        req.files.map(async (file) => await uploadService.generateImageUrl(file.filename))
      );
      res.status(200).json({ imageUrls });
    } catch (error) {
      console.error('이미지들 업로드 오류:', error);
      res.status(500).json({ message: '이미지들 업로드에 실패했습니다.' });
    }
  },
};

export default uploadController;