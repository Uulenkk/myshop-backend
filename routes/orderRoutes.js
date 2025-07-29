// routes/orderRoutes.js
import express from 'express';
import {
  createOrder,
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus,
  getOrdersByUserById,
} from '../controllers/orderController.js';
import { authenticateToken } from '../middleware/auth.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = express.Router();
router.get('/user/:userId', authenticateToken, getOrdersByUserById);
router.post('/', authenticateToken, createOrder); // хэрэглэгч бүр захиалга үүсгэнэ
router.get('/my', authenticateToken, getOrdersByUser); // өөрийн захиалгыг харах
router.get('/', authenticateToken, isAdmin, getAllOrders); // бүх захиалгыг админ л харна
router.put('/:id/status', authenticateToken, isAdmin, updateOrderStatus); // статус шинэчлэх
router.get('/user/:userId', authenticateToken, isAdmin, getOrdersByUserById);

export default router;
