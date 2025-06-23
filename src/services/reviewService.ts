import { Review } from "@prisma/client";
import reviewRepository from "../repositories/reviewRepository.js";

async function create(review: Review) {
  return reviewRepository.save(review);
}

async function getById(id: Review["id"]) {
  return reviewRepository.getById(id);
}

async function getAll() {
  return reviewRepository.getAll();
}

async function update(id: Review["id"], review: Review) {
  return reviewRepository.update(id, review);
}

async function deleteById(id: Review["id"]) {
  return reviewRepository.deleteById(id);
}

export default {
  create,
  getById,
  getAll,
  update,
  deleteById,
};
