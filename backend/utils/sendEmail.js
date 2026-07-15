import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 5858,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // Define message options
  const message = {
    from: `${process.env.SMTP_FROM_NAME || 'CampusConnect'} <${process.env.SMTP_FROM_EMAIL || 'noreply@campusconnect.edu'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(message);
    console.log('Email sent: %s', info.messageId);
    // If using Ethereal, log preview URL
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('Preview URL: %s', previewUrl);
    }
    return info;
  } catch (error) {
    console.error('Email Sending Failed:', error.message);
    // Return error without throwing, to prevent route from crashing
    return { error: true, message: error.message };
  }
};

export default sendEmail;
