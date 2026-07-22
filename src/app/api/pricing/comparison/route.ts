import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      labelId,
      labelEn,
      showStandard,
      showProfessional,
      showPremium,
      sortOrder,
    } = body;

    if (!labelId || !labelEn) {
      return NextResponse.json(
        { error: "labelId and labelEn are required" },
        { status: 400 }
      );
    }

    const comparison = await prisma.pricingComparison.create({
      data: {
        labelId,
        labelEn,
        showStandard: showStandard ?? true,
        showProfessional: showProfessional ?? false,
        showPremium: showPremium ?? false,
        sortOrder: sortOrder ?? 0,
      },
    });

    return NextResponse.json({ comparison }, { status: 201 });
  } catch (error) {
    console.error("Error creating comparison:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
