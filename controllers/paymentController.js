// controllers/paymentController.js

import prisma from '../prisma/client.js';
import { checkPaymentStatus } from '../services/qpayService.js'; // QPay төлбөр шалгах үйлдэл

export const confirmPayment = async (req, res) => {
  const { orderId } = req.body;

  try {
    // QPay эсвэл таны системээс төлбөрийн төлөвийг шалгах
    const paymentStatus = await checkPaymentStatus(orderId);

    if (paymentStatus === 'PAID') {
      // Төлбөр баталгаажсан учир захиалгын төлөвийг өөрчилж хадгалах
      await prisma.order.update({
        where: { id: Number(orderId) },
        data: { status: 'PAID' },
      });

      // Хэрэглэгчид мэдэгдэл илгээх код энд нэмнэ (имэйл, SMS, push notification гэх мэт)

      return res.json({ message: 'Төлбөр амжилттай баталгаажлаа' });
    } else {
      return res.status(400).json({ message: 'Төлбөр баталгаажаагүй байна' });
    }
  } catch (error) {
    console.error('Төлбөр баталгаажуулахад алдаа:', error);
    res.status(500).json({ message: 'Төлбөр баталгаажуулахад алдаа гарлаа' });
  }
};
