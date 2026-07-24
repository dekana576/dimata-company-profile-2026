import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/**
 * @swagger
 * /api/pricing/comparison/{id}:
 *   put:
 *     tags: [Pricing]
 *     summary: Update a pricing comparison row
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
 *               labelId:
 *                 type: string
 *               labelEn:
 *                 type: string
 *               showStandard:
 *                 type: boolean
 *               showProfessional:
 *                 type: boolean
 *               showPremium:
 *                 type: boolean
 *               sortOrder:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Comparison updated
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *   delete:
 *     tags: [Pricing]
 *     summary: Delete a pricing comparison row
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comparison deleted
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
    const {
      labelId,
      labelEn,
      showStandard,
      showProfessional,
      showPremium,
      sortOrder,
    } = body;

    const comparison = await prisma.pricingComparison.update({
      where: { id: Number(id) },
      data: {
        ...(labelId !== undefined && { labelId }),
        ...(labelEn !== undefined && { labelEn }),
        ...(showStandard !== undefined && { showStandard }),
        ...(showProfessional !== undefined && { showProfessional }),
        ...(showPremium !== undefined && { showPremium }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    });

    return NextResponse.json({ comparison });
  } catch (error) {
    console.error("Error updating comparison:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.pricingComparison.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting comparison:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
