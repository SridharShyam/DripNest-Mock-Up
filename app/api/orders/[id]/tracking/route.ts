import { NextRequest, NextResponse } from "next/server";
import { prisma as db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    const order = await db.order.findUnique({
      where: { id },
      include: {
        // @ts-ignore
        trackingEvents: {
          orderBy: {
            timestamp: "desc"
          }
        },
        items: true
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if user owns the order or is admin
    const user = session?.user as any;
    if (order.userId !== user?.id && user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Fetch tracking error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
