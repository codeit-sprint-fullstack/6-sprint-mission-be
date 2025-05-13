import productRepository from "../repositories/productRepository.js";

async function createProduct(product) {
  try {
    const createdProduct = await productRepository.save(product);
    return createdProduct;
  } catch (error) {
    throw error;
  }
}

async function getById(id, userId) {
  return await productRepository.getById(id, userId);
}

async function getProducts(keyword, orderBy) {
  const options = {};
  if (orderBy === "recent") {
    options.orderBy = { createdAt: "desc" };
  } else {
    options.orderBy = { favoriteCount: "desc" };
  }

  if (keyword) {
    options.where = {
      OR: [
        { name: { contains: keyword, mode: "insensitive" } },
        { description: { contains: keyword, mode: "insensitive" } },
      ],
    };
  }
  return await productRepository.getByOptions(options);
}

async function patchProduct(id, product) {
  try {
    const updatedProduct = await productRepository.edit(id, product);
    return updatedProduct;
  } catch (error) {
    throw error;
  }
}

async function deleteProduct(id) {
  try {
    const deletedProduct = await productRepository.remove(id);
    return deletedProduct;
  } catch (error) {
    throw error;
  }
}

async function postFavorite(id, userId) {
  try {
    const createdFavorite = await productRepository.createFavorite(id, userId);
    return createdFavorite;
  } catch (error) {
    throw error;
  }
}

async function deleteFavorite(id, userId) {
  try {
    const deletedFavorite = await productRepository.removeFavorite(id, userId);
    return deletedFavorite;
  } catch (error) {
    throw error;
  }
}

export default {
  createProduct,
  getById,
  deleteProduct,
  getProducts,
  patchProduct,
  postFavorite,
  deleteFavorite,
};
