import { NextResponse } from "next/server";
import { prisma as db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendRestockEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const user = session?.user as any;
    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { variantId } = await req.json();

    // @ts-ignore
    const alerts = await db.stockAlert.findMany({
      where: {
        variantId: variantId,
        isNotified: false,
      },
      include: {
        product: true,
        variant: true,
      },
    });

    if (alerts.length === 0) {
      return NextResponse.json({ success: true, notified: 0 });
    }

    // Send emails and update alerts
    for (const alert of alerts) {
      await sendRestockEmail(alert.email, alert.product, alert.variant);
      
      // @ts-ignore
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

    return NextResponse.json({ success: true, notified: alerts.length });
  } catch (error) {
    console.error("Trigger alerts error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
