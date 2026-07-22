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
    const { key, icon, iconDark, descriptionId, descriptionEn, sortOrder } =
      body;

    if (!key || !icon || !descriptionId || !descriptionEn) {
      return NextResponse.json(
        { error: "key, icon, descriptionId, and descriptionEn are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.pricingProduct.findUnique({
      where: { key },
    });
    if (existing) {
      return NextResponse.json(
        { error: `Product with key "${key}" already exists` },
        { status: 409 }
      );
    }

    const product = await prisma.pricingProduct.create({
      data: {
        key,
        icon,
        iconDark: iconDark || null,
        descriptionId,
        descriptionEn,
        sortOrder: sortOrder ?? (await prisma.pricingProduct.count()),
      },
    });

    const tiers = [];
    for (const deployment of ["saas", "onpremise"]) {
      for (const [name, idx] of [
        ["Standard", 0],
        ["Professional", 1],
        ["Premium", 2],
      ] as const) {
        const tier = await prisma.pricingTier.create({
          data: {
            productId: product.id,
            deployment,
            name,
            price: 0,
            period: "/ bulan",
            sortOrder: idx,
          },
        });
        tiers.push(tier);
      }
    }

    return NextResponse.json({ product, tiers }, { status: 201 });
  } catch (error) {
    console.error("Error creating pricing product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
