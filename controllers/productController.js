import prisma from '../prisma/client.js';
import { buildProductQuery, buildSort } from '../utils/filterQuery.js';
// Бүх барааг sizes-тай хамт авах


export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { sizes: true },
    });
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Нэг барааг sizes-тай хамт авах
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { sizes: true },
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Get product by id error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Шинэ бараа нэмэх
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      gender,
      price,
      material,
      description,
      type,
      sizes,
      colors,
    } = req.body;
    
    const colorsParsed = colors ? JSON.parse(colors) : [];
    const imagePaths = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
    const sizesParsed = sizes ? JSON.parse(sizes) : [];
   

    const product = await prisma.product.create({
  data: {
    name,
    category,
    gender,
    material,
    description,
    type,
    price: parseFloat(price),
    images: imagePaths,
      colors: colorsParsed, 
    sizes: {
      create: sizesParsed.map((s) => ({
        sizeLabel: s.sizeLabel,
        measurements: s.measurements,
      })),
    },
  },
  include: { sizes: true },
});


    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Барааг update хийх - sizes засахад анхаарал хандуулна уу
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const {
      name,
      category,
      gender,
      price,
      images,
      material,
      description,
      type,
      sizes,
      colors, 
    } = req.body;
     
   const colorsParsed = colors ? JSON.parse(colors) : [];
    // sizes JSON-аар ирвэл задлах
    const sizesParsed = sizes ? JSON.parse(sizes) : [];
    


    // Эхлээд sizes-ийг устгах (эсвэл өөр арга хэрэглэнэ)
    await prisma.productSize.deleteMany({
      where: { productId: Number(id) },
    });

    // Барааг шинэчлэн хадгалах
    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        category,
        gender,
        material,
        description,
          type, 
        price: parseFloat(price),
        images,
           colors: colorsParsed,  // sizes-г дахин нэмэх
        sizes: {
          create: sizesParsed.map((s) => ({
            sizeLabel: s.sizeLabel,
            measurements: s.measurements,
          })),
        },
      },
      include: { sizes: true },
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Барааг устгах
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    // 🧹 Захиалгатай холбоотой OrderProduct-уудыг устгана
    await prisma.orderProduct.deleteMany({
      where: { productId: Number(id) },
    });

    // 🧹 CartItem дээрх хамааралтай мөрүүдийг устгана
    await prisma.cartItem.deleteMany({
      where: { productId: Number(id) },
    });

    // 🧹 WishlistItem дээрх хамааралтай мөрүүдийг устгана
    await prisma.wishlistItem.deleteMany({
      where: { productId: Number(id) },
    });

    // 🧹 ProductSize-уудыг устгана
    await prisma.productSize.deleteMany({
      where: { productId: Number(id) },
    });

    // ✅ Эцэст нь өөрийг нь устгана
    await prisma.product.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('❌ Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
export const getAllProducts = async (req, res) => {
  try {
    const filter = buildProductQuery(req.query);
    const sort = buildSort(req.query);
    const page = Number(req.query.page) || 1;
    const limit = 1000;
    const skip = (page - 1) * limit;

    const products = await prisma.product.findMany({
      where: filter,
      orderBy: sort,
      skip,
      take: limit,
      include: { sizes: true },
    });

    res.json(products);
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

