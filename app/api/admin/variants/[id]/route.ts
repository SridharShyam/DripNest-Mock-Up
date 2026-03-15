import { NextRequest, NextResponse } from "next/server";
import { prisma as db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
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
    const { stock } = await request.json();

    if (stock === undefined) {
      return NextResponse.json({ error: "Stock value is required" }, { status: 400 });
    }

    const oldVariant = await db.variant.findUnique({
      where: { id },
    });

    if (!oldVariant) {
      return NextResponse.json({ error: "Variant not found" }, { status: 404 });
    }

    const variant = await db.variant.update({
      where: { id },
      data: { stock: parseInt(stock.toString()) },
    });

    // Update product-level stock summary
    const allVariants = await db.variant.findMany({
      where: { productId: variant.productId },
    });
    const totalStock = allVariants.reduce((sum, v) => sum + v.stock, 0);
    await db.product.update({
      where: { id: variant.productId },
      data: { stock: totalStock },
    });

    // If stock went from 0 to >0, trigger alerts
    let notifiedCount = 0;
    if (oldVariant.stock === 0 && variant.stock > 0) {
      const { sendRestockEmail } = await import("@/lib/email");
      const alerts = await db.stockAlert.findMany({
        where: {
          variantId: id,
          isNotified: false,
        },
        include: {
          product: true,
          variant: true,
        },
      });

      if (alerts.length > 0) {
        for (const alert of alerts) {
          await sendRestockEmail(alert.email, alert.product, alert.variant);
          await db.stockAlert.update({
            where: { id: alert.id },
            data: {
              isTriggered: true,
              triggeredAt: new Date(),
              isNotified: true,
              notifiedAt: new Date(),
            },
          });
        }
        notifiedCount = alerts.length;
      }
    }

    return NextResponse.json({ variant, notifiedCount });
  } catch (error) {
    console.error("Admin update variant error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
