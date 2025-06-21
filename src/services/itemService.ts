import { Item, User } from "../generated/prisma/index.js";
import itemRepository from "../repositories/itemRepository";

async function createItem(
  item: Pick<
    Item,
    "name" | "description" | "price" | "tags" | "images" | "userId"
  >
) {
  try {
    const createdItem = await itemRepository.save(item);
    return createdItem;
  } catch (error) {
    throw error;
  }
}

async function getById(id: Item["id"], userId: User["id"]) {
  return await itemRepository.getById(id, userId);
}

async function getItems(keyword: string, orderBy: "recent" | "favorite") {
  const options: any = {};
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
  return await itemRepository.getByOptions(options);
}

async function patchItem(
  id: Item["id"],
  item: Partial<
    Pick<Item, "name" | "description" | "price" | "tags" | "images">
  >
) {
  try {
    const updatedItem = await itemRepository.edit(id, item);
    return updatedItem;
  } catch (error) {
    throw error;
  }
}

async function deleteItem(id: Item["id"]) {
  try {
    const deletedItem = await itemRepository.remove(id);
    return deletedItem;
  } catch (error) {
    throw error;
  }
}

async function postFavorite(id: Item["id"], userId: User["id"]) {
  try {
    const createdFavorite = await itemRepository.createFavorite(id, userId);
    return createdFavorite;
  } catch (error) {
    throw error;
  }
}

async function deleteFavorite(id: Item["id"], userId: User["id"]) {
  try {
    const deletedFavorite = await itemRepository.removeFavorite(id, userId);
    return deletedFavorite;
  } catch (error) {
    throw error;
  }
}

export default {
  createItem,
  getById,
  deleteItem,
  getItems,
  patchItem,
  postFavorite,
  deleteFavorite,
};
