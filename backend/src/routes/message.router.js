import express from 'express';
import { authMiddle } from '../middleware/auth.middleware.js';
import { getMessage, getUsers, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.get('/users', authMiddle, getUsers);
router.get('/:id', authMiddle, getMessage);
router.post('/send/:id', authMiddle, sendMessage);

export default router;