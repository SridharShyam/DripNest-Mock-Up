import { NextRequest, NextResponse } from "next/server";
import { prisma as db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    // @ts-ignore
    const alert = await db.stockAlert.findUnique({
      where: { id },
    });

    if (!alert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }

    // Verify ownership if userId is present
    if (alert.userId && alert.userId !== (session?.user as any)?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-ignore
    await db.stockAlert.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete alert error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
