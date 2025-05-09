import prisma from "../config/client.prisma.js";

async function save(product) {
  return await prisma.product.create({
    data: {
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
    },
  });
}

// async function checkUserLiked(productId, userId) {
//   const user = await prisma.user.findUnique({
//     where: {id: userId},
//     select:{
//       isFavorite: {
//         where: { id: productId},
//       },
//     },
//   })
//   return user.isFavorite.length > 0
// }

// async function addFavorite(productId, userId) {
//   await prisma.product.update({
//     where: {id: id},
//     data: {isFavorite:}
//   })
// }

// async function removeFavorite(id) {
//   await prisma.product.update({
//     where: {id: id},
//     data: {isFavorite:}
//   })
// }

async function getById(id) {
  const product = await prisma.product.findUnique({
    where: { id },
  });
  return product;
}

async function getAll() {
  const products = await prisma.product.findMany();
  return products;
}

async function update(id, data) {
  const updatedProduct = await prisma.product.update({
    where: {
      id: id,
    },
    data: {
      images: data.images,
      tags: data.tags,
      price: data.price,
      description: data.description,
      name: data.name,
    },
  });
  return updatedProduct;
}

async function deleteById(id) {
  return await prisma.product.delete({
    where: { id },
  });
}

async function saveProductComment(comment) {
  const createdComment = await prisma.comment.create({
    data: {
      content: comment.content,
      productId: comment.productId,
      authorId: comment.authorId,
    },
  });
  return createdComment;
}

async function getAllProductComment(id) {
  const productComments = await prisma.comment.findMany({
    where: {
      productId: id,
    },
  });
  return productComments;
}

export default {
  save,
  getById,
  getAll,
  update,
  deleteById,
  saveProductComment,
  getAllProductComment,
};
