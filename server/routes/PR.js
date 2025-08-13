import express from "express";
import { listPRs, addPR, deletePR } from "../controllers/PR.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, listPRs);
router.post("/", verifyToken, addPR);
router.delete("/:id", verifyToken, deletePR);

export default router;


