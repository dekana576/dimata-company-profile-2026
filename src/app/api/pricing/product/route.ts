import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/**
 * @swagger
 * /api/pricing/product:
 *   post:
 *     tags: [Pricing]
 *     summary: Create a new pricing product
 *     description: Creates a product with 6 default tiers (Standard/Professional/Premium x SaaS/OnPremise).
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [key, icon, descriptionId, descriptionEn]
 *             properties:
 *               key:
 *                 type: string
 *                 description: Unique product key (e.g. "prochain", "hanoman")
 *               icon:
 *                 type: string
 *               iconDark:
 *                 type: string
 *               descriptionId:
 *                 type: string
 *               descriptionEn:
 *                 type: string
 *               sortOrder:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Product created with default tiers
 *       400:
 *         description: Validation error or duplicate key
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);
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
