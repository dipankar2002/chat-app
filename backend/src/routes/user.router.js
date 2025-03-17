import express from "express";
import { checkUser, login, logout, signup, updateProfile } from "../controllers/user.controller.js";
import { authMiddle } from "../middleware/auth.middleware.js";

const router = express.Router();

router.put('/update-profile', authMiddle, updateProfile);
router.get('/check', authMiddle, checkUser);

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

export default router;