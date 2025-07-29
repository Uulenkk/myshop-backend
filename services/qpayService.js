import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const QPAY_BASE_URL = process.env.QPAY_BASE_URL;
let accessToken = null;

// 1. Token авах
export 
const getQpayToken = async () => {
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const response = await axios.post(`${QPAY_BASE_URL}/v2/auth/token`, {
    client_id: process.env.QPAY_CLIENT_ID,
    client_secret: process.env.QPAY_SECRET,
  });

  accessToken = response.data.access_token;

  // Хугацааг тохируулах (жишээ нь 3600 секунд)
  tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000; // 60 секундээр илүү хурдан хугацаа дуусна гэж үзэх

  return accessToken;
};

// 2. Төлбөр үүсгэх

  export const createInvoice = async (amount, orderId) => {
  const token = await getQpayToken();

  try {
    const invoiceRes = await axios.post(`${QPAY_BASE_URL}/v2/invoice`, {
      invoice_code: process.env.QPAY_TEMPLATE_ID,
      sender_invoice_no: orderId,
      invoice_receiver_code: "terminal",
      invoice_description: "Захиалга #" + orderId,
      amount,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return invoiceRes.data;
  } catch (error) {
    console.error('QPay invoice үүсгэх алдаа:', error.response?.data || error.message);
    throw error;
  }
};

export const checkPaymentStatus = async (invoiceId) => {
  const token = await getQpayToken();

  try {
    const response = await axios.get(`${QPAY_BASE_URL}/v2/invoice/${invoiceId}/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.status; // 'PAID', 'PENDING' гэх мэт төлөв
  } catch (error) {
    console.error('QPay төлбөрийн статус шалгах алдаа:', error.response?.data || error.message);
    throw error;
  }
};
