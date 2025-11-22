import { transporter } from './nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Damday Village" <noreply@damdayvillage.com>',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

// Order Confirmation Email
export async function sendOrderConfirmation(order: any) {
  const orderItems = order.orderItems || [];
  const shippingAddress = JSON.parse(order.shippingAddress || '{}');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #10b981; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9fafb; }
        .order-details { background-color: white; padding: 15px; margin: 20px 0; border-radius: 8px; }
        .item { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        .total { font-size: 18px; font-weight: bold; margin-top: 20px; padding-top: 20px; border-top: 2px solid #10b981; }
        .button { display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmation</h1>
          <p>Thank you for your purchase!</p>
        </div>
        
        <div class="content">
          <p>Hi ${order.user?.name || shippingAddress.fullName || 'Valued Customer'},</p>
          <p>Your order has been confirmed and will be shipped soon.</p>
          
          <div class="order-details">
            <h2 style="margin-top: 0;">Order Details</h2>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
            <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
            
            <h3>Items</h3>
            ${orderItems.map((item: any) => `
              <div class="item">
                <strong>${item.name || item.product?.name || 'Product'}</strong><br>
                Quantity: ${item.quantity} × ₹${item.price.toLocaleString('en-IN')}<br>
                Subtotal: ₹${(item.quantity * item.price).toLocaleString('en-IN')}
              </div>
            `).join('')}
            
            <div class="total">
              <p>Subtotal: ₹${order.subtotal.toLocaleString('en-IN')}</p>
              <p>Shipping: ₹${order.shipping.toLocaleString('en-IN')}</p>
              <p>Tax (5%): ₹${order.tax.toLocaleString('en-IN')}</p>
              <p style="font-size: 20px; color: #10b981;">Total: ₹${order.total.toLocaleString('en-IN')}</p>
            </div>
          </div>
          
          <div class="order-details">
            <h3>Shipping Address</h3>
            <p>
              ${shippingAddress.fullName || ''}<br>
              ${shippingAddress.address || ''}<br>
              ${shippingAddress.city || ''}, ${shippingAddress.state || ''} ${shippingAddress.postalCode || ''}<br>
              Phone: ${shippingAddress.phone || ''}<br>
              Email: ${shippingAddress.email || order.user?.email || ''}
            </p>
          </div>
          
          <p style="text-align: center;">
            <a href="${process.env.NEXTAUTH_URL || 'https://damdayvillage.com'}/user/orders" class="button">
              View Order Status
            </a>
          </p>
          
          <p>Your order will be delivered within 3-5 business days. You'll receive a tracking number once your order ships.</p>
          
          <p>If you have any questions, please contact our support team at support@damdayvillage.com</p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} Damday Village. All rights reserved.</p>
          <p>Smart Village Marketplace - Empowering Rural Communities</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Order Confirmation - ${order.orderNumber}

Thank you for your purchase!

Order Details:
Order Number: ${order.orderNumber}
Order Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}
Payment Status: ${order.paymentStatus}

Items:
${orderItems.map((item: any) => `${item.name || item.product?.name} - Qty: ${item.quantity} × ₹${item.price}`).join('\n')}

Subtotal: ₹${order.subtotal}
Shipping: ₹${order.shipping}
Tax: ₹${order.tax}
Total: ₹${order.total}

Shipping Address:
${shippingAddress.fullName}
${shippingAddress.address}
${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}

Track your order: ${process.env.NEXTAUTH_URL}/user/orders

Damday Village - Smart Village Marketplace
  `;

  return sendEmail({
    to: order.user?.email || shippingAddress.email || '',
    subject: `Order Confirmation - ${order.orderNumber}`,
    html,
    text,
  });
}

// Booking Confirmation Email
export async function sendBookingConfirmation(booking: any) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Booking Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #3b82f6; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9fafb; }
        .booking-details { background-color: white; padding: 15px; margin: 20px 0; border-radius: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Confirmed!</h1>
        </div>
        <div class="content">
          <p>Your booking has been confirmed.</p>
          <div class="booking-details">
            <h2>Booking Details</h2>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString('en-IN')}</p>
            <p><strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString('en-IN')}</p>
            <p><strong>Guests:</strong> ${booking.guests}</p>
            <p><strong>Total Amount:</strong> ₹${booking.totalPrice.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: booking.user.email,
    subject: `Booking Confirmation - ${booking.id}`,
    html,
  });
}

// Admin Notification Email
export async function sendAdminNotification(subject: string, message: string) {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@damdayvillage.com';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Admin Notification</title>
    </head>
    <body>
      <h2>${subject}</h2>
      <p>${message}</p>
      <p><em>Sent from Damday Village Platform</em></p>
    </body>
    </html>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `[Admin] ${subject}`,
    html,
  });
}
