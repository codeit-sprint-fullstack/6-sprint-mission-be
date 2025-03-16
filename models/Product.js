import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    tags: {
      type: [String],
    },
    likes: {
      type: Number,
    },
    // TODO: 추후 이미지 업로드 기능 추가 시 사용
    // images: {
    //   type: [String],
    // },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model('Product', productSchema);
