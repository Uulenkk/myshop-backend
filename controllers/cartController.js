import pool from '../models/db.js';

export const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    // Байгаа эсэхийг шалгах
    const existing = await pool.query(
      'SELECT * FROM "CartItem" WHERE "userId" = $1 AND "productId" = $2',
      [userId, productId]
    );

    if (existing.rows.length > 0) {
      // Тоог нэмэх
      const newQuantity = existing.rows[0].quantity + quantity;
      const updated = await pool.query(
        'UPDATE "CartItem" SET quantity = $1 WHERE "userId" = $2 AND "productId" = $3 RETURNING *',
        [newQuantity, userId, productId]
      );
      res.json(updated.rows[0]);
    } else {
      // Шинээр нэмэх
      const inserted = await pool.query(
        'INSERT INTO "CartItem" ("userId", "productId", quantity) VALUES ($1, $2, $3) RETURNING *',
        [userId, productId, quantity]
      );
      res.json(inserted.rows[0]);
    }
  } catch (error) {
    console.error('Error in addToCart:', error);
    res.status(500).json({ error: 'Серверийн алдаа гарлаа' });
  }
};

export const getCart = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'userId нь тоон утга байх ёстой' });
  }
  try {
    const result = await pool.query(
      `SELECT c.*, p.name, p.price, p.images, p.size, p.colors 
       FROM "CartItem" c 
       JOIN "Product" p ON c."productId" = p.id 
       WHERE c."userId" = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error in getCart:', error);
    res.status(500).json({ error: 'Серверийн алдаа гарлаа' });
  }
};



export const removeFromCart = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    await pool.query(
      'DELETE FROM "CartItem" WHERE "userId" = $1 AND "productId" = $2',
      [userId, productId]
    );
    res.sendStatus(204);
  } catch (error) {
    console.error('Error in removeFromCart:', error);
    res.status(500).json({ error: 'Серверийн алдаа гарлаа' });
  }
};
export const removeOneFromCart = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const existing = await pool.query(
      'SELECT quantity FROM "CartItem" WHERE "userId" = $1 AND "productId" = $2',
      [userId, productId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'CartItem олдсонгүй' });
    }

    const currentQuantity = existing.rows[0].quantity;

    if (currentQuantity > 1) {
      const updated = await pool.query(
        'UPDATE "CartItem" SET quantity = quantity - 1 WHERE "userId" = $1 AND "productId" = $2 RETURNING *',
        [userId, productId]
      );
      res.json(updated.rows[0]);
    } else {
      await pool.query(
        'DELETE FROM "CartItem" WHERE "userId" = $1 AND "productId" = $2',
        [userId, productId]
      );
      res.json({ message: 'Сагснаас бүрэн устгалаа' });
    }
  } catch (error) {
    console.error('Error in removeOneFromCart:', error);
    res.status(500).json({ error: 'Серверийн алдаа гарлаа' });
  }
};
