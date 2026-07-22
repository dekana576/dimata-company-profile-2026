import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { discountPercent } = body;

    const discount = await prisma.pricingDiscount.update({
      where: { id: Number(id) },
      data: {
        ...(discountPercent !== undefined && {
          discountPercent: Number(discountPercent),
        }),
      },
    });

    return NextResponse.json({ discount });
  } catch (error) {
    console.error("Error updating discount:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
