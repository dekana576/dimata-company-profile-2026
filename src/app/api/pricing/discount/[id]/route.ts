import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/**
 * @swagger
 * /api/pricing/discount/{id}:
 *   put:
 *     tags: [Pricing]
 *     summary: Update a pricing discount
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
 *               discountPercent:
 *                 type: number
 *     responses:
 *       200:
 *         description: Discount updated
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
    const { discountPercent } = body;

    const discount = await prisma.pricingDiscount.update({
      where: { id: Number(id) },
      data: {
        ...(discountPercent !== undefined && {
          discountPercent: Number(discountPercent),
        }),
      },
    });

    return NextResponse.json({ discount });
  } catch (error) {
    console.error("Error updating discount:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
