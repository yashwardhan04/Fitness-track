import express from "express";
import { createBlog, updateBlog, getBlogs, getBlogById } from "../controllers/Blog.js";
import {verifyToken}  from "../middleware/verifyToken.js";

const router = express.Router();

// Create a new blog (auth required)
router.post("/", verifyToken, createBlog);

// Update a blog (auth required)
router.put("/:id", verifyToken, updateBlog);

// Get all blogs or by date
router.get("/", getBlogs);

// Get a single blog by id
router.get("/:id", getBlogById);

export default router; 