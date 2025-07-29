// controllers/orderController.js
import prisma from '../prisma/client.js';

export const createOrder = async (req, res) => {
  try {
    const { items, totalPrice, name, phone, address, aimag, district } = req.body;
    const userId = req.user?.userId;

    console.log("===> Creating order with data:");
    console.log("User ID:", userId);
    console.log("Items:", items);
    console.log("Total Price:", totalPrice);
    console.log("Name:", name);
    console.log("Phone:", phone);
    console.log("Address:", address);

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    if (!totalPrice || typeof totalPrice !== "number") {
      return res.status(400).json({ message: "Valid total price is required" });
    }

    const order = await prisma.order.create({
      data: {
        userId,
        totalPrice,
        name,    // 👈 нэмэгдсэн
        phone,   // 👈 нэмэгдсэн
        address, // 👈 нэмэгдсэн
            aimag,     // ✅ Нэмсэн
    district,  // ✅ Нэмсэн
        status: "Pending",
        orderItems: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            color: item.color,
            size: item.size,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    console.log("✅ Order created:", order);
    res.status(201).json(order);
  } catch (error) {
    console.error("❌ Failed to create order:", error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};


export const getOrdersByUserById = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get orders' });
  }
};
export const getOrdersByUser = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get orders' });
  }
};


export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        orderItems: {
          include: { product: true },
        },
      },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get all orders' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.order.update({
      where: { id: Number(id) },
      data: { status },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status' });
  }
};
