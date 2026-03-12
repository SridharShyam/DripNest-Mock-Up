import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { items, subtotal, discount, shipping, total, promoCode, address } = body;

    const order = await prisma.order.create({
      data: {
        userId: (session.user as any).id,
        subtotal,
        discount,
        shipping,
        total,
        promoCode,
        shippingAddress: address,
        status: 'PENDING',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            qty: item.qty,
            priceAtPurchase: item.price,
            productName: item.name,
            productImage: item.image,
          }))
        }
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = (session.user as any).id;
    const isAdmin = (session.user as any).role === 'ADMIN';

    // If admin and no specific userId requested, return all. Otherwise return own.
    const orders = await prisma.order.findMany({
      where: isAdmin ? {} : { userId },
      include: {
        items: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
