import prisma from '../prisma/client.js';

// Бүх барааг авах
export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Нэг бараа авах
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Шинэ бараа нэмэх
export const createProduct = async (req, res) => {
  const { name, category, gender, price, images, material } = req.body;
  try {
    const product = await prisma.product.create({
      data: {
        name,
        category,
        gender,
        price: parseFloat(price),
        images,
        material,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Барааг засах
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, category, gender, price, images, material } = req.body;
  try {
    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        category,
        gender,
        price: parseFloat(price),
        images,
        material,
      },
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Барааг устгах
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({
      where: { id: Number(id) },
    });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
