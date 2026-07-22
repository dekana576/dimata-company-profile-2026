import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [products, tiers, bundleFeatures, discounts, comparison] =
      await Promise.all([
        prisma.pricingProduct.findMany({ orderBy: { sortOrder: "asc" } }),
        prisma.pricingTier.findMany({
          orderBy: { sortOrder: "asc" },
          include: { features: { orderBy: { sortOrder: "asc" } } },
        }),
        prisma.pricingBundleFeature.findMany({
          orderBy: { sortOrder: "asc" },
        }),
        prisma.pricingDiscount.findMany({ orderBy: { sortOrder: "asc" } }),
        prisma.pricingComparison.findMany({ orderBy: { sortOrder: "asc" } }),
      ]);

    return NextResponse.json({
      products,
      tiers,
      bundleFeatures,
      discounts,
      comparison,
    });
  } catch (error) {
    console.error("Error fetching admin pricing:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
