import User from "../models/User.js";
import Workout from "../models/Workout.js";
import { createError } from "../error.js";

export const getGoals = async (req, res, next) => {
  try {
    const user = await User.findById(req.user?.id).select('goals').lean();
    if (!user) return next(createError(404, 'User not found'));
    res.json(user.goals || { weeklyCalories: 0, weeklyWorkouts: 0 });
  } catch (err) { next(err); }
};

export const updateGoals = async (req, res, next) => {
  try {
    const { weeklyCalories, weeklyWorkouts } = req.body;
    const update = {};
    if (weeklyCalories !== undefined) update['goals.weeklyCalories'] = parseInt(weeklyCalories, 10) || 0;
    if (weeklyWorkouts !== undefined) update['goals.weeklyWorkouts'] = parseInt(weeklyWorkouts, 10) || 0;
    const user = await User.findByIdAndUpdate(req.user?.id, { $set: update }, { new: true }).select('goals');
    res.json(user.goals);
  } catch (err) { next(err); }
};

export const computeWeeklyStats = async (userId) => {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfLast7 = new Date(startOfToday.getFullYear(), startOfToday.getMonth(), startOfToday.getDate() - 6);
  const end = new Date(startOfToday.getTime() + 24*60*60*1000);
  const [agg, count] = await Promise.all([
    Workout.aggregate([
      { $match: { user: userId, date: { $gte: startOfLast7, $lt: end } } },
      { $group: { _id: null, total: { $sum: "$caloriesBurned" } } },
    ]),
    Workout.countDocuments({ user: userId, date: { $gte: startOfLast7, $lt: end } })
  ]);
  return { totalCalories: agg[0]?.total || 0, workouts: count };
};


