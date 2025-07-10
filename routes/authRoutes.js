import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router(); // ЭХЛЭЭД router-г зарлах ёстой!!!

// Хамгаалалттай route
router.get('/profile', authenticateToken, async (req, res) => {
  res.json({
    message: 'Secure user data',
    user: req.user, // token-аас авсан мэдээлэл
  });
});

// Бүртгэл ба нэвтрэлт
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
