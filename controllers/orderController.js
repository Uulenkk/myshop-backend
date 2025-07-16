// controllers/orderController.js
import prisma from '../prisma/client.js';

export const createOrder = async (req, res) => {
  try {
    const { items, totalPrice } = req.body;
    const userId = req.user.userId;

    const order = await prisma.order.create({
      data: {
        userId,
        totalPrice,
        orderItems: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: { product: true },
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
