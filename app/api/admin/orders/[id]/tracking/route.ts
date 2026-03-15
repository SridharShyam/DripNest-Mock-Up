import { NextResponse } from "next/server";
import { prisma as db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendOrderUpdateEmail } from "@/lib/email";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;
    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status, title, description, location, timestamp } = await req.json();

    const order = await db.order.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // @ts-ignore
    const event = await db.trackingEvent.create({
      data: {
        orderId: id,
        status,
        title,
        description,
        location,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        isCompleted: true,
      }
    });

    // Update Order Status
    const updateData: any = { 
      // @ts-ignore
      currentStatus: status 
    };
    if (status === 'DELIVERED') {
      updateData.status = 'DELIVERED';
    }

    await db.order.update({
      where: { id },
      data: updateData
    });

    // Send Email
    if (order.user?.email) {
      await sendOrderUpdateEmail(order.user.email, order, event);
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Admin add tracking error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
