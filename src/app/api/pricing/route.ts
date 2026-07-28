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

    const deployments = ["saas", "onpremise"] as const;
    const pricing: Record<string, Record<string, { id: string; tiers: unknown[] }>> = {};
    
    for (const dep of deployments) {
      pricing[dep] = {};
      for (const product of products) {
        const pk = product.key;
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
            hidePrice: t.hidePrice,
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
      const hidePrices: Record<string, Record<string, boolean>> = {}; // <-- TAMBAHKAN INI
      const features: Record<string, Record<string, string[]>> = {};
      
      for (const dep of deployments) {
        prices[dep] = {};
        hidePrices[dep] = {}; // <-- TAMBAHKAN INI
        features[dep] = {};
        
        for (const tierName of ["Standard", "Professional", "Premium"]) {
          const tier = tiers.find(
            (t) =>
              t.productId === p.id &&
              t.deployment === dep &&
              t.name === tierName
          );
          prices[dep][tierName] = tier?.price ?? 0;
          hidePrices[dep][tierName] = tier?.hidePrice ?? false; // <-- TAMBAHKAN INI
          features[dep][tierName] = bundleFeatures
            .filter(
              (bf) =>
                bf.productId === p.id &&
                bf.deployment === dep &&
                bf.tierName === tierName
            )
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((bf) => (lang === "en" ? bf.labelEn : bf.labelId));
        }
      }
      return {
        key: p.key,
        description: lang === "en" ? p.descriptionEn : p.descriptionId,
        prices,
        hidePrices, // <-- TAMBAHKAN INI KE RESPONS API
        features,
      };
    });

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