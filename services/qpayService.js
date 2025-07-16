import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const QPAY_BASE_URL = process.env.QPAY_BASE_URL;
let accessToken = null;

// 1. Token авах
export const getQpayToken = async () => {
  const response = await axios.post(`${QPAY_BASE_URL}/v2/auth/token`, {
    client_id: process.env.QPAY_CLIENT_ID,
    client_secret: process.env.QPAY_SECRET,
  });
  accessToken = response.data.access_token;
  return accessToken;
};

// 2. Төлбөр үүсгэх
export const createInvoice = async (amount, orderId) => {
  if (!accessToken) await getQpayToken();

  const invoiceRes = await axios.post(`${QPAY_BASE_URL}/v2/invoice`, {
    invoice_code: process.env.QPAY_TEMPLATE_ID,
    sender_invoice_no: orderId,
    invoice_receiver_code: "terminal",
    invoice_description: "Захиалга #" + orderId,
    amount,
  }, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return invoiceRes.data; // QR зураг, invoice_id гэх мэт буцаана
};
