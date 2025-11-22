import nodemailer from 'nodemailer';

// Create transporter lazily to avoid build-time errors
let transporterInstance: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporterInstance) {
    transporterInstance = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    });
  }
  return transporterInstance;
}

export const transporter = {
  sendMail: async (options: nodemailer.SendMailOptions) => {
    return getTransporter().sendMail(options);
  },
  verify: async () => {
    return getTransporter().verify();
  },
};

// Verify transporter configuration
export async function verifyEmailConnection() {
  try {
    await transporter.verify();
    console.log('Email server is ready to send messages');
    return true;
  } catch (error) {
    console.error('Email server connection failed:', error);
    return false;
  }
}

// Test email function
export async function sendTestEmail(to: string) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Damday Village" <noreply@damdayvillage.com>',
      to,
      subject: 'Test Email from Damday Village',
      text: 'This is a test email from Damday Village platform.',
      html: '<p>This is a test email from <strong>Damday Village</strong> platform.</p>',
    });

    console.log('Test email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send test email:', error);
    throw error;
  }
}
