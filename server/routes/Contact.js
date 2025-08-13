import express from "express";
import { createContactMessage, getMyContacts, getAllContacts, updateContactStatus } from "../controllers/Contact.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();

router.post("/", verifyToken, createContactMessage);
router.get("/my", verifyToken, getMyContacts);
router.get("/", verifyToken, requireAdmin, getAllContacts);
router.patch("/:id/status", verifyToken, requireAdmin, updateContactStatus);

export default router;