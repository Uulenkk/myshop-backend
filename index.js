import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import path from 'path';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';

dotenv.config();

const app = express();

// ----------- Middleware -----------

app.use(cors());
app.use(express.json());

app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);

// JSON payloads авахад ашиглана


// multipart/form-data дэмжих middleware-г route дээр `multer`-тэй хэрэглэдэг тул энд заавал тохируулах шаардлагагүй

// static зураг үзүүлэх (локалд хадгалсан зургуудыг client талд serve хийх)
app.use('/uploads', express.static(path.resolve('uploads')));

// ----------- Routes -----------

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// ----------- Start Server -----------

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
