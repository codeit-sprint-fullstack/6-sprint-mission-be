import { User } from "@prisma/client";
import userRepository from "../repositories/userRepository";
import { UserResponseDTO, UserResponseSchema } from "../dto/user.dto";
import { NotFoundError } from "../types/errors";

async function getById(id: User["id"]): Promise<UserResponseDTO> {
  const user = await userRepository.findById(id);

  if (!user) throw new NotFoundError("사용자를 찾을 수 없습니다.");

  const parsed = UserResponseSchema.safeParse(user);

  if (!parsed.success)
    throw new Error("DB에서 반환된 사용자 정보가 형식과 다릅니다.");

  return parsed.data;
}

export default {
  getById,
};
