import Blog from "../models/Blog.js";


// Create a new blog
export const createBlog = async (req, res, next) => {
  try {
    const { title, content, date } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required" 
      });
    }
    
    if (!title || !content || !date) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const author = req.user.id;
    const blog = new Blog({ title, content, date, author });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    console.error("Error creating blog:", err);
    next(err);
  }
};

// Update an existing blog
export const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, date } = req.body;
    const blog = await Blog.findByIdAndUpdate(
      id,
      { title, content, date },
      { new: true }
    );
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    next(err);
  }
};

// Get all blogs (optionally by date)
export const getBlogs = async (req, res, next) => {
  try {
    const { date } = req.query;
    let filter = {};
    if (date) {
      // Find blogs for the specific day
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }
    const blogs = await Blog.find(filter).sort({ date: -1 });
    res.json(blogs);
  } catch (err) {
    next(err);
  }
};

// Get a single blog by ID
export const getBlogById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    next(err);
  }
};