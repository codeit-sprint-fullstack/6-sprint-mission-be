import userService from "../service/userService.js";
import authService from "../service/authService.js";

// 유저 프로필 정보 조회
const getProfile = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const user = await userService.getUserById(userId);
    return res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

// 유저 정보 수정
const updateUser = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

    const data = {
      ...req.body,
      image: imagePath,
    };

    const updated = await userService.updateUser(userId, data);
    return res.json(updated);
  } catch (error) {
    next(error);
  }
};

// 비밀번호 변경
const changePassword = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      const error = new Error("현재 비밀번호와 새 비밀번호가 모두 필요합니다.");
      error.code = 400;
      throw error;
    }

    // 현재 비밀번호 검증 및 새 비밀번호로 변경
    await authService.changePassword(userId, currentPassword, newPassword);

    return res
      .status(200)
      .json({ message: "비밀번호가 성공적으로 변경되었습니다." });
  } catch (error) {
    next(error);
  }
};

export default {
  updateUser,
  getProfile,
  changePassword,
};
