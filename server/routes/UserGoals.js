import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { getGoals, updateGoals } from '../controllers/UserGoals.js';

const router = express.Router();

router.get('/', verifyToken, getGoals);
router.put('/', verifyToken, updateGoals);

export default router;


