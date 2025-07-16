import prisma from '../prisma/client.js';

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
  const user = await prisma.user.findUnique({
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
