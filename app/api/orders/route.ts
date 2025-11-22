import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendOrderConfirmation } from '@/lib/email/sendEmail';

// Generate unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `ORD-${timestamp}-${random}`.toUpperCase();
}

// Calculate totals
function calculateTotals(items: any[]) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 500 ? 0 : 50; // Free shipping above ₹500
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + shipping + tax;

  return { subtotal, shipping, tax, total };
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { cartItems, shippingAddress, billingAddress, paymentId, razorpayOrderId, total } = body;

    // Validate cart items
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Validate addresses
    if (!shippingAddress) {
      return NextResponse.json(
        { error: 'Shipping address is required' },
        { status: 400 }
      );
    }

    // Calculate totals
    const totals = calculateTotals(cartItems);

    // Create order with transaction (atomic operation)
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: session.user.id,
          total: totals.total,
          subtotal: totals.subtotal,
          shipping: totals.shipping,
          tax: totals.tax,
          shippingAddress: JSON.stringify(shippingAddress),
          billingAddress: JSON.stringify(billingAddress || shippingAddress),
          paymentMethod: 'RAZORPAY',
          paymentStatus: paymentId ? 'PAID' : 'PENDING',
          status: paymentId ? 'CONFIRMED' : 'PENDING',
          paymentDetails: paymentId ? JSON.stringify({
            paymentId,
            razorpayOrderId,
            timestamp: new Date().toISOString(),
          }) : null,
        },
      });

      // Create order items and reduce inventory
      for (const item of cartItems) {
        // Create order item
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId || item.id,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
          },
        });

        // Reduce product inventory
        await tx.product.update({
          where: { id: item.productId || item.id },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Fetch complete order with items and user
      const completeOrder = await tx.order.findUnique({
        where: { id: newOrder.id },
        include: {
          user: true,
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      return completeOrder;
    });

    // Send order confirmation email (don't wait for it)
    if (order && paymentId) {
      sendOrderConfirmation(order).catch((error) => {
        console.error('Failed to send confirmation email:', error);
      });
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order!.id,
        orderNumber: order!.orderNumber,
        total: order!.total,
        status: order!.status,
        createdAt: order!.createdAt,
      },
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's orders
    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
