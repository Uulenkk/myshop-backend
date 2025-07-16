// routes/cartRoutes.js

import express from 'express';
import {
  addToCart,
  getCart,
  removeFromCart,
  removeOneFromCart // ← энэ мөрийг нэмж байна
} from '../controllers/cartController.js';

const router = express.Router();

router.post('/', addToCart);                 // POST /api/cart
router.get('/:userId', getCart);             // GET  /api/cart/:userId
router.delete('/', removeFromCart);          // DELETE /api/cart
router.put('/decrease', removeOneFromCart);  // PUT /api/cart/decrease (1-р багасгах)

export default router;
