import express from 'express';
import {
  getAllUsers,
  getUserById,
  deleteUser,
  makeAdmin
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = express.Router();

router.get('/', authenticateToken, isAdmin, getAllUsers);
router.get('/:id', authenticateToken, isAdmin, getUserById);
router.delete('/:id', authenticateToken, isAdmin, deleteUser);
router.put('/:id/admin', authenticateToken, isAdmin, makeAdmin);

export default router;
