import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL, 
      pass: process.env.EMAIL_PASSWORD, 
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject,
    html,
  });
};

// Verify Email Endpoint
export const verifyEmail = async (req, res) => {
    const { token } = req.query;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) return res.status(400).json({ error: 'Invalid token' });
  
      user.isVerified = true;
      await user.save();
      res.status(200).json({ message: 'Email verified successfully!' });
    } catch (err) {
      res.status(400).json({ error: 'Email verification failed' });
    }
  };

  export const sendEmailNotification = async (userEmail, subject, message) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  
    const mailOptions = {
      from: process.env.EMAIL,
      to: userEmail,
      subject,
      text: message,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

