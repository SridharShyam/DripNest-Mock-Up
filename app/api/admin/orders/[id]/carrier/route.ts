import { NextRequest, NextResponse } from "next/server";
import { prisma as db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;
    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const { carrierName, trackingNumber, estimatedDelivery } = await request.json();

    // @ts-ignore
    const order = await db.order.update({
      where: { id },
      data: {
        carrierName,
        trackingNumber,
        estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : null,
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Admin update carrier error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
