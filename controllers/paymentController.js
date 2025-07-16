import { createInvoice } from '../services/qpayService.js';

export const initiatePayment = async (req, res) => {
  try {
    const { amount, orderId } = req.body;
    const invoice = await createInvoice(amount, orderId);
    res.json(invoice); // QR code, invoice_id г.м
  } catch (error) {
    console.error('QPay алдаа:', error.response?.data || error.message);
    res.status(500).json({ message: 'QPay төлбөр үүсгэхэд алдаа гарлаа' });
  }
};
