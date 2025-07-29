import express from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import {
  getAllUsers,
  getUserById,
  deleteUser,
  makeAdmin,
  updateOwnProfile,
  getOwnProfile,
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';
import { isAdmin } from '../middleware/isAdmin.js';

const prisma = new PrismaClient();
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // upload folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

router.get('/me', authenticateToken, getOwnProfile);
router.get('/', authenticateToken, isAdmin, getAllUsers);
router.get('/:id', authenticateToken, isAdmin, getUserById);
router.put('/me', authenticateToken, updateOwnProfile);

// Шинэ маршрутыг энд нэмнэ
router.post(
  '/upload-profile-image',
  authenticateToken,
  upload.single('profileImage'),
  async (req, res) => {
    try {
      // Token-аас хэрэглэгчийн id-г гаргаж авна гэж төсөөлж байна, эсвэл body-с авна
      const userId = req.user.id; // authenticateToken middleware-д userId нэмэгдсэн гэж үзвэл
      
      const user = await prisma.user.update({
        where: { id: userId },
        data: { profileImageUrl: imageUrl },
      });

      res.json({ success: true, imageUrl });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Зураг хадгалахад алдаа гарлаа' });
    }
  }
);

router.delete('/:id', authenticateToken, isAdmin, deleteUser);
router.put('/:id/admin', authenticateToken, isAdmin, makeAdmin);

export default router;
