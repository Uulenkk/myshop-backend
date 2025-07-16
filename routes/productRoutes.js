import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { authenticateToken } from '../middleware/auth.js';
import { isAdmin } from '../middleware/isAdmin.js';
import { upload } from '../middleware/upload.js';  // multer-н middleware-г энд импортлох

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Зураг upload хийх middleware-г энд нэмнэ
router.post('/', authenticateToken, isAdmin, upload.array('images', 10), createProduct);
router.put('/:id', authenticateToken, isAdmin, upload.array('images', 10), updateProduct);

router.delete('/:id', authenticateToken, isAdmin, deleteProduct);

export default router;
