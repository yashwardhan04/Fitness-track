import PR from "../models/PR.js";
import { createError } from "../error.js";

export const listPRs = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { exercise, metric } = req.query;
    const filter = { user: userId };
    if (exercise) filter.exercise = { $regex: exercise, $options: "i" };
    if (metric) filter.metric = metric;
    const prs = await PR.find(filter).sort({ value: -1, createdAt: -1 }).lean();
    res.json(prs);
  } catch (err) {
    next(err);
  }
};

export const addPR = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { exercise, metric, value, unit, workout, note } = req.body;
    if (!exercise || !metric || value == null) {
      return next(createError(400, "exercise, metric and value are required"));
    }
    const pr = await PR.create({ user: userId, exercise, metric, value, unit, workout, note });
    res.status(201).json(pr);
  } catch (err) {
    next(err);
  }
};

export const deletePR = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const deleted = await PR.findOneAndDelete({ _id: id, user: userId });
    if (!deleted) return next(createError(404, "PR not found"));
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};


