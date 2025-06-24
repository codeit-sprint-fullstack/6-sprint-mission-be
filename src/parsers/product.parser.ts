import { productDto } from "../dtos/product.dto";

export const parseProductDto = (body: productDto) => {
  return {
    name: body.name,
    description: body.description,
    price: Number(body.price),
    tags: body.tags,
  };
};
