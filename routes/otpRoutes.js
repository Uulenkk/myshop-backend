import 'dotenv/config';
import express from 'express';
import sendOtpEmail from '../controllers/mailOTPController.js';

const router = express.Router();

router.post('/send-otp', sendOtpEmail)

export default router;
