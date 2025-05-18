import { is } from "superstruct";

export function validateRequest(struct) {
  return function (req, res, next) {
    try {
      if (!is(req.body, struct)) {
        const [error] = struct.validate(req.body);
        return res
          .status(400)
          .json({ message: "Invalid request data", errors: error.details });
      }
      next(); // If validation passes, proceed to the next middleware/controller
    } catch (error) {
      next(error);
    }
  };
}
