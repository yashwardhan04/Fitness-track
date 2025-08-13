import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import UserRoutes from "./routes/User.js";
import blogRoutes from './routes/Blog.js';
import contactRoutes from './routes/Contact.js';
import prRoutes from './routes/PR.js';
import goalRoutes from './routes/UserGoals.js';
import cron from 'node-cron';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();

// CORS
const corsOptions = {
  origin: ['https://fitness-track40.netlify.app', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", UserRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/prs', prRoutes);
app.use('/api/goals', goalRoutes);

// error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Server Error";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Hello developers! Welcome to the Fitness Tracker API",
  });
});

const connectDB = () => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.MONGODB_URL)
    .then((res) => console.log("Connected to Mongo DB"))
    .catch((err) => {
      console.error("failed to connect with mongo");
      console.error(err);
    });
};

const startServer = async () => {
  try {
    connectDB();
    app.listen(8080, () => console.log("Server started on port 8080"));
  } catch (error) {
    console.log(error);
  }
};

startServer();

// ===== Scheduled Jobs =====
// Email transporter (configure env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: false,
  auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  } : undefined,
});

// Lazy import models to avoid circulars during startup
import User from './models/User.js';
import Workout from './models/Workout.js';
import { computeWeeklyStats } from './controllers/UserGoals.js';

// Helper: compute last 7 days calories per user
const computeWeeklySummaryForUser = async (userId) => computeWeeklyStats(new mongoose.Types.ObjectId(userId));

// Weekly summary email: every Monday at 08:00
cron.schedule('0 8 * * 1', async () => {
  try {
    const users = await User.find({}).select('email name').lean();
    for (const u of users) {
      if (!u.email) continue;
      const stats = await computeWeeklySummaryForUser(u._id);
      const userDoc = await User.findById(u._id).select('goals').lean();
      const goals = userDoc?.goals || { weeklyCalories: 0, weeklyWorkouts: 0 };
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'no-reply@fittrack.local',
        to: u.email,
        subject: 'Your Weekly Fitness Summary',
        text: `Hi ${u.name || ''},\n\nIn the last 7 days: \n- Total calories: ${Math.round(stats.totalCalories)} (goal: ${goals.weeklyCalories || 0})\n- Workouts: ${stats.workouts} (goal: ${goals.weeklyWorkouts || 0})\n\nKeep it up!`,
      };
      try { await transporter.sendMail(mailOptions); } catch {}
    }
    console.log('Weekly summaries sent');
  } catch (e) {
    console.error('Weekly summary job failed', e);
  }
});

// Daily nudges at 19:00 for users with zero calories today
cron.schedule('0 19 * * *', async () => {
  try {
    const users = await User.find({}).select('email name').lean();
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    for (const u of users) {
      if (!u.email) continue;
      const todayAgg = await Workout.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(u._id), date: { $gte: start, $lt: end } } },
        { $group: { _id: null, total: { $sum: "$caloriesBurned" } } },
      ]);
      const total = todayAgg[0]?.total || 0;
      if (total === 0) {
        const mailOptions = {
          from: process.env.EMAIL_FROM || 'no-reply@fittrack.local',
          to: u.email,
          subject: 'Quick Nudge: Log a workout today',
          text: `Hi ${u.name || ''},\n\nNo workouts logged today. A short session can make a big difference!`,
        };
        try { await transporter.sendMail(mailOptions); } catch {}
      }
    }
    console.log('Daily nudges processed');
  } catch (e) {
    console.error('Daily nudge job failed', e);
  }
});