import prisma from "../config/client.prisma.js";

async function save(product) {
  return await prisma.product.create({
    data: {
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      imageUrl: product.imageUrl,
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

async function getById(productId, userId) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      favorites: {
        where: { userId },
        select: { id: true },
      },
    },
  });

  return { ...product, isLiked: product.favorites.length > 0 };
}

async function getAll(options) {
  const { order = "createdAt", skip = 0, take = 4, keyword = "" } = options;

  // const orderByField =
  //   order === "recent"
  //     ? "createdAt"
  //     : order === "favorite"
  //     ? { favorites: { _count: "desc" } }
  //     : null;

  let orderByOption;

  if (order === "favorite") {
    orderByOption = {
      favorites: {
        _count: "desc",
      },
    };
  } else {
    orderByOption = {
      [order]: "desc",
    };
  }

  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: keyword,
        mode: "insensitive",
      },
    },
    orderBy: orderByOption,
    skip,
    take,
    include: {
      _count: {
        select: { favorites: true },
      },
    },
  });
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
