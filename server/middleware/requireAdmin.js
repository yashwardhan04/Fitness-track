import User from "../models/User.js";
import { createError } from "../error.js";

export const requireAdmin = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(createError(401, "Unauthorized"));
    const user = await User.findById(userId).lean();
    if (!user || user.role !== "admin") {
      return next(createError(403, "Admin only"));
    }
    next();
  } catch (err) {
    next(err);
  }
};
