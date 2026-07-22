import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get("lang") === "en" ? "en" : "id";

    const [products, tiers, discounts, comparison] = await Promise.all([
      prisma.pricingProduct.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.pricingTier.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        include: { features: { orderBy: { sortOrder: "asc" } } },
      }),
      prisma.pricingDiscount.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.pricingComparison.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);

    const bundleFeatures = await prisma.pricingBundleFeature.findMany({
      orderBy: { sortOrder: "asc" },
    });

    const productMap = new Map(products.map((p) => [p.key, p]));

    // Assemble pricing data per deployment
    const deployments = ["saas", "onpremise"] as const;
    const productKeys = ["prochain", "hanoman", "hairisma", "aiso"] as const;

    const pricing: Record<string, Record<string, { id: string; tiers: unknown[] }>> = {};
    for (const dep of deployments) {
      pricing[dep] = {};
      for (const pk of productKeys) {
        const product = productMap.get(pk);
        if (!product) continue;
        const productTiers = tiers.filter(
          (t) => t.productId === product.id && t.deployment === dep
        );
        pricing[dep][pk] = {
          id: pk,
          tiers: productTiers.map((t) => ({
            name: t.name,
            price: `Rp ${t.price.toLocaleString("id-ID")}`,
            priceRaw: t.price,
            period: t.period,
            highlighted: t.highlighted,
            badge: t.badge,
            features: t.features.map((f) => ({
              label: lang === "en" ? f.labelEn : f.labelId,
              included: f.included,
            })),
          })),
        };
      }
    }

    // Assemble bundle data
    const bundleApps = products.map((p) => {
      const prices: Record<string, Record<string, number>> = {};
      const features: Record<string, string[]> = {};
      for (const dep of deployments) {
        prices[dep] = {};
        for (const tierName of ["Standard", "Professional", "Premium"]) {
          const tier = tiers.find(
            (t) =>
              t.productId === p.id &&
              t.deployment === dep &&
              t.name === tierName
          );
          prices[dep][tierName] = tier?.price ?? 0;
        }
      }
      for (const tierName of ["Standard", "Professional", "Premium"]) {
        features[tierName] = bundleFeatures
          .filter(
            (bf) =>
              bf.productId === p.id && bf.tierName === tierName
          )
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((bf) => (lang === "en" ? bf.labelEn : bf.labelId));
      }
      return {
        key: p.key,
        description: lang === "en" ? p.descriptionEn : p.descriptionId,
        prices,
        features,
      };
    });

    // Assemble comparison
    const comparisonData = comparison.map((c) => ({
      label: lang === "en" ? c.labelEn : c.labelId,
      tiers: [
        ...(c.showStandard ? ["standard"] : []),
        ...(c.showProfessional ? ["professional"] : []),
        ...(c.showPremium ? ["premium"] : []),
      ],
    }));

    return NextResponse.json({
      products: products.map((p) => ({
        key: p.key,
        icon: p.icon,
        iconDark: p.iconDark,
        description: lang === "en" ? p.descriptionEn : p.descriptionId,
      })),
      pricing,
      bundleApps,
      discounts: discounts.map((d) => ({
        minApps: d.minApps,
        discountPercent: d.discountPercent,
      })),
      comparison: comparisonData,
    });
  } catch (error) {
    console.error("Error fetching pricing:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
