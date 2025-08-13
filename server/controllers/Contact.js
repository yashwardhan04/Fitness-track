import Contact from "../models/Contact.js";

export const createContactMessage = async (req, res, next) => {
  try {
    const { subject, message, name, email } = req.body;

    if (!subject || !message) {
      return res
        .status(400)
        .json({ success: false, message: "Subject and message are required" });
    }

    const doc = await Contact.create({
      user: req.user?.id,
      name,
      email,
      subject,
      message,
    });

    return res
      .status(201)
      .json({ success: true, message: "Message received", data: doc });
  } catch (err) {
    next(err);
  }
};

export const getMyContacts = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 10, status } = req.query;
    const filter = { user: userId };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [items, total] = await Promise.all([
      Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
      Contact.countDocuments(filter),
    ]);
    res.json({
      items,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    next(err);
  }
};

export const getAllContacts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [items, total] = await Promise.all([
      Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
      Contact.countDocuments(filter),
    ]);
    res.json({
      items,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    next(err);
  }
};

export const updateContactStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["new", "read", "closed"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
    // Admin route will be protected by requireAdmin; update by _id only
    const updated = await Contact.findOneAndUpdate(
      { _id: id },
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: "Not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};