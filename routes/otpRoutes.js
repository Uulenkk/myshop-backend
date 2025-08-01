import 'dotenv/config';
import express from 'express';
import { sendOtpEmail, verifyOtpEmail } from '../controllers/mailOTPController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/send-otp', authenticateToken, sendOtpEmail);
router.post('/verify-otp', authenticateToken, verifyOtpEmail)

export default router;
