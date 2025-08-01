import nodemailer from 'nodemailer';
import prisma from '../prisma/client.js';
import bcrypt from 'bcrypt';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'suppmate4@gmail.com',
    pass: 'jzyuopcnagthnwwk',
  },
});

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000);
}

export async function sendOtpEmail(req, res) {
  const otp = generateOtp();
  await prisma.user.update({
  where: { id: req.user.userId },
  data: { otp: otp },
  });

  

  const mailOptions = {
    from: 'suppmate4@gmail.com',
    to: req.user.email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent with OTP:', otp);
    res.status(200).json({ message: 'Email sent', otp });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}

export async function verifyOtpEmail(req, res){
  const {otp, newPassword} = req.body;
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.userId
    },
    select: {
      otp: true
    }
  })
  if (user.otp == otp){
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: {
        id: req.user.userId
      },
      data: {
        password: hashedPassword
      }
    })
    return res.json({message: "success"})
  } 
  res.json({message: "wrong otp"})
}

