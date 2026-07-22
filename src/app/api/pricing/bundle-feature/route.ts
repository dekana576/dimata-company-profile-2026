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
    const { productId, deployment, tierName, labelId, labelEn, sortOrder } =
      body;

    if (!productId || !deployment || !tierName || !labelId || !labelEn) {
      return NextResponse.json(
        {
          error:
            "productId, deployment, tierName, labelId, and labelEn are required",
        },
        { status: 400 }
      );
    }

    const bundleFeature = await prisma.pricingBundleFeature.create({
      data: {
        productId: Number(productId),
        deployment,
        tierName,
        labelId,
        labelEn,
        sortOrder: sortOrder ?? 0,
      },
    });

    return NextResponse.json({ bundleFeature }, { status: 201 });
  } catch (error) {
    console.error("Error creating bundle feature:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
