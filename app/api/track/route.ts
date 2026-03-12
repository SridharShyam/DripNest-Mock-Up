import { NextResponse } from "next/server";
import { prisma as db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { orderId, email } = await req.json();

    if (!orderId || !email) {
      return NextResponse.json({ error: "Missing Order ID or Email" }, { status: 400 });
    }

    // Support both DN- prefixed and raw IDs
    const cleanId = orderId.replace(/^DN-/, "");

    const order = await db.order.findFirst({
      where: {
        OR: [
          { id: cleanId },
          { id: orderId }
        ],
        user: {
          email: email
        }
      },
      include: {
        items: true,
        // @ts-ignore
        trackingEvents: {
          orderBy: {
            timestamp: "desc"
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: "No order found with these details." }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Tracking error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
