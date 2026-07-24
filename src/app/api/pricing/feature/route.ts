import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/**
 * @swagger
 * /api/pricing/feature:
 *   post:
 *     tags: [Pricing]
 *     summary: Create a pricing feature
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tierId, labelId, labelEn]
 *             properties:
 *               tierId:
 *                 type: integer
 *               labelId:
 *                 type: string
 *               labelEn:
 *                 type: string
 *               included:
 *                 type: boolean
 *                 default: true
 *               sortOrder:
 *                 type: integer
 *                 default: 0
 *     responses:
 *       201:
 *         description: Feature created
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
    const { tierId, labelId, labelEn, included, sortOrder } = body;

    if (!tierId || !labelId || !labelEn) {
      return NextResponse.json(
        { error: "tierId, labelId, and labelEn are required" },
        { status: 400 }
      );
    }

    const feature = await prisma.pricingFeature.create({
      data: {
        tierId: Number(tierId),
        labelId,
        labelEn,
        included: included !== undefined ? included : true,
        sortOrder: sortOrder ?? 0,
      },
    });

    return NextResponse.json({ feature }, { status: 201 });
  } catch (error) {
    console.error("Error creating pricing feature:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
