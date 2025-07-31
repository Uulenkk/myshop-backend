import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'suppmate4@gmail.com',       // your email address
    pass: 'jzyuopcnagthnwwk', // your email password or app password
  },
});

async function sendOtpEmail(req, res) {
  const mailOptions = {
    from: 'suppmate4@gmail.com',
    to: req.body.toEmail,
    subject: 'Verify code test',
    text: `Your OTP code is: 12234`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent!');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export default sendOtpEmail;
