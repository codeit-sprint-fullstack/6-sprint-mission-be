import userService from "../services/userService.js";

// GET /users/me
export async function getMe(req, res, next) {
  try {
    const user = await userService.getUserById(req.auth.userId);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

// PATCH /users/me
export async function updateMe(req, res, next) {
  try {
    const updated = await userService.updateUser(req.auth.userId, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// PATCH /users/me/password
export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body; // currentPassword 추가
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: "현재 비밀번호와 새 비밀번호를 모두 입력해주세요." 
      });
    }
    
    const updated = await userService.changePassword(
      req.auth.userId,
      currentPassword, // 추가
      newPassword
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// GET /users/me/products
export async function getMyProducts(req, res, next) {
  try {
    // 추후 productService.getProductsByUserId(req.auth.userId)
    res.status(501).json({ message: "Not implemented yet" });
  } catch (err) {
    next(err);
  }
}

// GET /users/me/favorites
export async function getMyFavorites(req, res, next) {
  try {
    // 추후 productService.getFavoritesByUserId(req.auth.userId)
    res.status(501).json({ message: "Not implemented yet" });
  } catch (err) {
    next(err);
  }
}
