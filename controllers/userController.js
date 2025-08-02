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
    const userId = req.user?.userId; // эндээс авна

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },  // id-г зөв дамжуулна
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        username: true,
        isAdmin: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('❌ Failed to get user profile:', error);
    res.status(500).json({ message: 'Failed to get user profile' });
  }
};

export const updateOwnProfile = async (req, res) => {
  const { name, email, phone, currentPassword, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Хэрвээ newPassword ирсэн бол currentPassword шалгах хэрэгтэй
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to change password' });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }
    }

    let hashedPassword;
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(newPassword, salt);
    }

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
