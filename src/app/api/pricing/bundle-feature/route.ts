import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/**
 * @swagger
 * /api/pricing/bundle-feature:
 *   post:
 *     tags: [Pricing]
 *     summary: Create a bundle feature for a product
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, deployment, tierName, labelId, labelEn]
 *             properties:
 *               productId:
 *                 type: integer
 *               deployment:
 *                 type: string
 *                 enum: [saas, onpremise]
 *               tierName:
 *                 type: string
 *                 enum: [Standard, Professional, Premium]
 *               labelId:
 *                 type: string
 *               labelEn:
 *                 type: string
 *               sortOrder:
 *                 type: integer
 *                 default: 0
 *     responses:
 *       201:
 *         description: Bundle feature created
 *       400:
 *         description: Missing required fields
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
