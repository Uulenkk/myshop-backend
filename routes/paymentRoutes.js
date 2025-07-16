import express from 'express';
import { initiatePayment } from '../controllers/paymentController.js';
import paymentRoutes from './routes/paymentRoutes.js';
app.use('/services', paymentRoutes);

const router = express.Router();
router.post('/static/qr_codes/qpay', initiatePayment);


export default router;
