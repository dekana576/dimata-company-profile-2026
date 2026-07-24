import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/**
 * @swagger
 * /api/pricing/tier/{id}:
 *   put:
 *     tags: [Pricing]
 *     summary: Update a pricing tier
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *               period:
 *                 type: string
 *               highlighted:
 *                 type: boolean
 *               badge:
 *                 type: string
 *                 nullable: true
 *               sortOrder:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Tier updated
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { price, period, highlighted, badge, sortOrder, isActive } = body;

    const tier = await prisma.pricingTier.update({
      where: { id: Number(id) },
      data: {
        ...(price !== undefined && { price: Number(price) }),
        ...(period !== undefined && { period }),
        ...(highlighted !== undefined && { highlighted }),
        ...(badge !== undefined && { badge: badge || null }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({ tier });
  } catch (error) {
    console.error("Error updating pricing tier:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
