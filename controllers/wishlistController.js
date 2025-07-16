import pool from '../models/db.js';

// Wishlist-д бүтээгдэхүүн нэмэх

const addToWishlist = async (req, res) => {
  const { userId, productId } = req.body; // camelCase байх ёстой

  if (!userId || !productId) {
    return res.status(400).json({ error: 'userId болон productId шаардлагатай байна' });
  }

  try {
    const existing = await pool.query(
      'SELECT * FROM "WishlistItem" WHERE "userId" = $1 AND "productId" = $2',
      [userId, productId]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Бүтээгдэхүүн аль хэдийн wishlist-д байна' });
    }

    const result = await pool.query(
      'INSERT INTO "WishlistItem" ("userId", "productId") VALUES ($1, $2) RETURNING *',
      [userId, productId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error in addToWishlist:', error);
    res.status(500).json({ error: 'Серверийн алдаа гарлаа' });
  }
};

// Wishlist-с бүх бүтээгдэхүүнүүдийг авах
const getWishlist = async (req, res) => {
  const userId = req.params.user_id;
  try {
    const result = await pool.query(
      'SELECT w.*, p.name, p.price, p.images FROM "WishlistItem" w JOIN "Product" p ON w."productId" = p.id WHERE w."userId" = $1',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error in getWishlist:', error);
    res.status(500).json({ error: 'Серверийн алдаа гарлаа' });
  }
};


// Wishlist-с бүтээгдэхүүн устгах
const removeFromWishlist = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    await pool.query(
      'DELETE FROM "WishlistItem" WHERE "userId" = $1 AND "productId" = $2',
      [userId, productId]
    );
    res.sendStatus(204);
  } catch (error) {
    console.error('Error in removeFromWishlist:', error);
    res.status(500).json({ error: 'Серверийн алдаа гарлаа' });
  }
};

export {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};
