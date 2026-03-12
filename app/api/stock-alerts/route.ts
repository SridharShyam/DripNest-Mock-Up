import { NextResponse } from "next/server";
import { prisma as db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { email, productId, variantId, size, colour } = body;

    if (!email || !productId || !variantId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // @ts-ignore
    const existing = await db.stockAlert.findFirst({
      where: {
        email,
        variantId,
        isNotified: false,
      },
    });

    if (existing) {
      return NextResponse.json({ success: true, message: "Already on the list" });
    }

    // @ts-ignore
    const alert = await db.stockAlert.create({
      data: {
        email,
        productId,
        variantId,
        size,
        colour,
        userId: (session?.user as any)?.id || null,
      },
    });

    return NextResponse.json({ success: true, alert });
  } catch (error) {
    console.error("Stock alert error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-ignore
    const alerts = await db.stockAlert.findMany({
      where: {
        userId: (session.user as any).id,
      },
      include: {
        product: true,
        variant: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(alerts);
  } catch (error) {
    console.error("Fetch alerts error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
