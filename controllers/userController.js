import prisma from '../prisma/client.js';
import bcrypt from 'bcryptjs';
// Бүх хэрэглэгч
export const getAllUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, isAdmin: true }
  });
  res.json(users);
};

// Нэг хэрэглэгч
export const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findFirst({
    where: { id: Number(id) },
    select: { id: true, name: true, email: true, isAdmin: true }
  });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

// Устгах
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({ where: { id: Number(id) } });
  res.json({ message: 'User deleted' });
};

// Админ болгох
export const makeAdmin = async (req, res) => {
  const { id } = req.params;
  const updatedUser = await prisma.user.update({
    where: { id: Number(id) },
    data: { isAdmin: true }
  });
  res.json({ message: 'User is now admin', user: updatedUser });
};
// Өөрийн мэдээллийг авах (token-аас id авна)
export const getOwnProfile = async (req, res) => {
  try {
    const userId = req.user.id; // authenticateToken middleware-аас
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        username: true, // username: true,
         profileImageUrl: true,
        isAdmin: true
      }
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
export const updateOwnProfile = async (req, res) => {
  const { name, email, phone, password } = req.body;
   if (email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(400).json({ message: 'Email already in use by another user' });
      }
    }
  let hashedPassword;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
  }

  try {
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name,
        email,
        phone,
        ...(hashedPassword && { password: hashedPassword }),
      },
    });

    res.json({ message: 'Profile updated successfully', user: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};
export const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const imagePath = req.file.path;
    const imageUrl = `${req.protocol}://${req.get('host')}/${imagePath}`;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { profileImageUrl: imageUrl },
    });

    res.json({ success: true, imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to upload profile image' });
  }
};